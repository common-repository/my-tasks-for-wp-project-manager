=== My Tasks for WP Project Manager ===

Contributors:      Tyler Tork
Plugin Name:       My Tasks for WP Project Manager
Plugin URI:        https://torknado.com/mytasks
Tags:              project management, task tracking
Author URI:        https://torknado.com/
Author:            Tyler Tork
Donate link:       https://torknado.com/donate
Requires at least: 4.4 
Tested up to:      5.7
Stable tag:        0.1
Version:           0.1
License:           GPLv2 (or later)

== Description ==

The plugin WP Project Manager by weDevs lacks a screen where a logged-in user can see a list of tasks assigned to them, with due dates, and overdue items highlighted.
This plugin supplies that missing piece via a smartcode, with arguments to control task selection (the default being all open tasks for the current user). This is implemented using the WP Project Manager's ReST API, so it's also an example of how to use the API for your own custom UI elements.

To insert a task table into a page of your site, use the shortcode: [tnado_mytasks]

The following arguments are available:

- select='all|completed|late|open' -- which tasks to display in the table (default=open).
- buttons='true|false' -- (default true) whether to display complete and reopen buttons.
- confirm='true|false' -- (default true) whether to prompt user for confirmation when they click a complete or reopen button.
- limit=(number) -- how many rows to display, -1 (default) for no limit. There's no paging here -- you can just limit the number of rows displayed. Suggest displaying two tables -- one with all open items, one with a limited number of completed ones.
- class=(class name) -- CSS style to apply to containing div, default none.

The elements are tagged as follows:

- id='tnado_mytasks' for the containing div.
- class='tnado_mytasks_task_table' for the table element.
- th elements are used for the table heading row
- class='tnado_mytasks_task' for a tr element displaying a task that's open but not overdue.
- class='tnado_mytasks_task tnado_completed' on the tr element if the task has status 'closed'.
- class='tnado_mytasks_task tnado_overdue' on the tr element if the task is open and past its due date.
- class='tnado_mytasks_taskname' on the td element containing the task name/link.
- class='tnado_mytasks_projname' on the td element containing the project name/link.
- class='tnado_mytasks_due_date' on the td containing the due date.
- class='tnado_mytasks_buttoncell' on the td containing the due date.
- class='tnado_mytasks_button tnado_mytasks_reopen' on the input element for the "reopen" button.
- class='tnado_mytasks_button tnado_mytasks_complete' on the input element for the "reopen" button.

Not all of these styles are defined in the plugin's stylesheet -- some are used just to let you style the table easily with custom CSS if you don't like your theme's default presentation. Please note a table can be made responsive with CSS, if that's a concern.

== Installation ==

- Visit Plugins > Add New.
- Search for "My Tasks for WP Project Manager".
- Click Install, then Activate.
- There is nothing to configure. See the Description section of this screen for shortcode syntax.

== Upgrade Notice ==

== Screenshots ==

1. A smartcode displays a table of tasks that are due or overdue for the current user. The task name and project name are links. The user can mark a task complete by clicking the Complete button.(https://torknado.com/wp-content/uploads/2020/07/screenshot1.gif)

2. By default the plugin only displays open tasks, but you can opt to show all tasks in a single table, or use multiple shortcodes to display a separate table of recently closed tasks, so the user can reopen tasks closed by mistake.(https://torknado.com/wp-content/uploads/2020/07/screenshot2.gif)

== Changelog ==

== Frequently Asked Questions ==

== Donations ==

This work is entirely donation-supported. If you find this tool useful (even if only as an example of how to write your own code using the ReST API), please [consider donating](https://torknado.com/donate).