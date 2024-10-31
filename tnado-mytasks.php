<?php
/**
 * Plugin Name: My Tasks for WP Project Manager
 * Plugin URI: http://torknado.com/mytasks
 * Description: Addon shortcode to display "my tasks" in wedev's "WP Project Manager" plugin.
 *      [tnado_mytasks] - a list of the current user's tasks.
 *          arguments
 *              title=heading to display above them
 *              select=all, late, open, completed to affect which tasks are displayed
 *              buttons=true(default)/false whether to have buttons that let the user mark things complete or un-complete from this list.
 *              limit=(number) how many entries to load, default all.
 *				confirm=true(default)/false whether to ask user to confirm a "complete" or "reopen" action.
 * Version: 1.0
 * Author: Tyler Tork
 * Author URI: http://www.torknado.com
 * License: GPLv2 or later
 */

add_shortcode('tnado_mytasks', 'tnado_mytasks');

function tnado_mytasks_load_plugin_css() {
    $plugin_url = plugin_dir_url( __FILE__ );

    wp_enqueue_style( 'tnado_styles', $plugin_url . '/tnado-styles.css' );
    wp_enqueue_script( 'tnado_script', $plugin_url . '/tnado-my-tasks.js');
}
add_action( 'wp_enqueue_scripts', 'tnado_mytasks_load_plugin_css' );

function tnado_mytasks($atts) {
    $a = shortcode_atts( array(
      'buttons' => 'true',
      'select' => 'open',
      'limit' => -1,
	  'confirm' => 'true',
	  'class' => ''
   ), $atts );
    $Content = '<div id="tnado_mytasks"' . ($a['class'] == '' ? '' : (' class="' . $a['class'] . '"')) . '></div>';
	// several strings used on client side, defined here for potential translation.
    $parms = array_merge($a, array(
        'taskName' => _('Task name'),
        'project' => _('Project'),
        'dueDate' => _('Due date'),
        'completedStatus' => _('Done'),
        'lateFmt' => _('(late {0} days)'),
        'daysFmt' => _('(in {0} days)'),
        'completeLabel' => _('Complete'),
        'reopenLabel' => _('Reopen'),
        'completePrompt' => _('Mark this task completed?'),
		'reopenPrompt' => _('Reopen this task?'),
        'noTasks' => _('You have no open tasks.'),
        'loading' => _('Loading tasks...'),
        'taskDescFmt' => _('{0} in project {1}'),
        'nonce' => wp_create_nonce( 'wp_rest' ),
        'userid' =>  get_current_user_id()
    ));
    $Content .= '<script>tnadoMyTasks.loadMyTasks(' . json_encode($parms) . ');</script>';
    return $Content;
}
?>