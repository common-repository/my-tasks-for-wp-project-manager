var tnadoMyTasks = {
    userId: 0,
    completeButtons : true,
    strings : [],
    taskTitles : [],
    myNonce: "",
	doConfirm: true,
    
    loadMyTasks : function(parms) {
	    this.completeButtons = (parms.buttons == 'true');
		this.doConfirm = (parms.confirm == 'true');
        this.strings = parms;
        this.userId = parms.userid;
        this.myNonce = parms.nonce;
        this.reloadTasks();
    },

    reloadTasks : function() {
        var ddiv = document.getElementById('tnado_mytasks');
        ddiv.innerHTML = '<i>' + this.strings['loading'] + '</i>';
        var request = new XMLHttpRequest();
        var searchArg = '&status=0'; // open tasks
        var perPageArg = '&pages=1&per_page=' + tnadoMyTasks.strings.limit

        switch(tnadoMyTasks.strings.select) {
            case 'all':
                searchArg = '';
                break;
            case 'completed':
                searchArg = '&status=1';
                break;
            case 'late':
                searchArg += '&due_date=' + tnadoMyTasks.todayISO() + '&due_date_operator%5B%5D=less_than';
        }
        request.open('GET', '/wp-json/pm/v2/tasks/?&login_user=' + this.userId
         + searchArg + perPageArg + '&users=' + this.userId + '&orderby=due_date%3Aasc&per_page=-1&is_admin=1&with=project');
        request.onload = this.receiveTasks;
        request.send();
    },

    receiveTasks: function() {
        var nnow = new Date();
        var ddiv = document.getElementById('tnado_mytasks');
        var obj = JSON.parse(this.response);
        var items = obj['data'];
        var th = "";
        if (items.length == 0) {
            th = '<i>' + tnadoMyTasks.strings['noTasks'] + '</i>';
        } else {
            th = '<table class="tnado_mytasks_task_table"><tr><th>' + tnadoMyTasks.strings['taskName'] + '</th><th>' 
                + tnadoMyTasks.strings['project'] + '</th><th>' 
                + tnadoMyTasks.strings['dueDate'] + '</th>'
                + (tnadoMyTasks.completeButtons ? '<th></th>' : '')
                + '</tr>';
            for (var i = 0; i < items.length; i++) {
                var row = items[i];
                var due = row.due_date;
                var overdue = false;
                var complete = (row.status == 'complete');
                var szDue = tnadoMyTasks.strings.completedStatus;
                tnadoMyTasks.taskTitles[row.id] = tnadoMyTasks.strings['taskDescFmt'].replace('{0}', row.title).replace('{1}', row.project.title);
                if (!complete && due != undefined && due.timestamp != undefined) {
                    var wwhen = new Date(due.timestamp);
                    overdue = wwhen < nnow;
                    var days = Math.abs(tnadoMyTasks.date_diff_indays(wwhen, nnow));
                    var fmtstr = tnadoMyTasks.strings[overdue ? 'lateFmt' : 'daysFmt'];
                    szDue = wwhen.toLocaleDateString(undefined, {day:'numeric',month:'short',year:'numeric'}) 
                        + ' ' + fmtstr.replace("{0}", ""+days);
                }
                var buttonCode = '';
                if (tnadoMyTasks.completeButtons) {
                    buttonCode = '<td class="tnado_mytasks_buttoncell">';
                    if (complete) {
                        buttonCode += '<input type="button" class="tnado_mytasks_button tnado_mytasks_reopen" value="' 
                            + tnadoMyTasks.escapeHtml(tnadoMyTasks.strings['reopenLabel'])
                            + '" onclick="tnadoMyTasks.setTaskStatus(' + row.id + ', ' + row.project_id + ', 0)">';
                    } else {
                        buttonCode += '<input type="button" class="tnado_mytasks_button tnado_mytasks_complete" value="' 
                            + tnadoMyTasks.escapeHtml(tnadoMyTasks.strings['completeLabel'])
                            + '" onclick="tnadoMyTasks.setTaskStatus(' + row.id + ', ' + row.project_id + ', 1)">';
                    }
                    buttonCode += '</td>';
                }
                var itemURL = '/wp-admin/admin.php?page=pm_projects#/projects/' + row.project_id + '/task-lists/' + row.task_list_id + '/tasks/' + row.id;
                var projectURL = '/wp-admin/admin.php?page=pm_projects#/projects/' + row.project.project_id + '/overview';
                th += '<tr class="tnado_mytasks_task' + (complete ? ' tnado_mytasks_completed' : overdue ? ' tnado_mytasks_overdue' : '' ) + '">'
                    + '<td class="tnado_mytasks_taskname"><a href="' + itemURL + '" target="tnado-task">' + tnadoMyTasks.escapeHtml(row.title) + '</a></td>'
                    + '<td class="tnado_mytasks_projname"><a href="' + projectURL + '" target="tnado-task">' + tnadoMyTasks.escapeHtml(row.project.title) + '</a></td>'
                    + '<td class="tnado_mytasks_due_date">' + tnadoMyTasks.escapeHtml(szDue) + '</td>'
                    + buttonCode + '</tr>';
            }
            th += '</table>'
        }
        ddiv.innerHTML = th;
    },

    escapeHtml: function(unsafe) {
        var nod = document.createTextNode(unsafe);
        var pre = document.createElement('pre');
        pre.appendChild(nod);
        return pre.innerHTML;
    },

    date_diff_indays: function (dt1, dt2) {
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    },

    setTaskStatus : function(taskId, projId, newStatus) {
        var confirmed = true;
        var prompt = tnadoMyTasks.strings[newStatus == 1 ? 'completePrompt' : 'reopenPrompt'];
        if (prompt != undefined && tnadoMyTasks.doConfirm) {
            confirmed = confirm(tnadoMyTasks.taskTitles[taskId] + '\n' + prompt);
        }
        if (confirmed) {
            var params = 'task_id=' + taskId + '&status=' + newStatus + '&project_id=' + projId + '&is_admin=1';
            var request = new XMLHttpRequest();
            request.open('POST', '/wp-json/pm/v2/projects/' + projId + '/tasks/' + taskId + '/change-status', true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.setRequestHeader('X-WP-Nonce', tnadoMyTasks.myNonce);
            request.onload = this.receiveCommandResult;
            request.send(params);
        }
    },

    receiveCommandResult : function() {
        var obj = JSON.parse(this.response);
        if (obj.code != undefined) {
            alert(obj.message.join('\n'));
        } else {
            var ddiv = document.getElementById('tnado_mytasks');
            ddiv.innerHTML = tnadoMyTasks.reloadTasks();
        }
    },

    todayISO : function() {
        var nnow = new Date();
        return nnow.toISOString().substr(0,10);
    }
}
