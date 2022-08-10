<?php
/**
 * Plugin Name:       Ski Resort
 * Description:       A block to display resorts based on select
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Deepesh S
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ski-resort
 *
 * @package Ski_Resort
 */

//Pull Rest Routes
require_once dirname(__FILE__) . '/inc/rest.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function Create_Block_Ski_Resort_Block_init()
{
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'Create_Block_Ski_Resort_Block_init');
