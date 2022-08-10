<?php
/**
 * Creating Proxy endpoint.
 *
 * @category Custom_Block
 * @package  Ski_Resort
 * @author   Deepesh S <s.deepeshh@gmail.com>
 * @license  https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0-or-later
 * @link     https://www.gnu.org/licenses/gpl-2.0.html
 */

add_action(
    'rest_api_init', function () {

        register_rest_route(
            'ski/v1', 'autocomplete(?:/(?P<state>\d+))?', array(
            'methods'             => 'GET',
            'callback' => 'Proxy_Fnugg_Autocomplete_api',
            'args' => [
              'state'
            ],
            )
        );

        register_rest_route(
            'ski/v1', 'search(?:/(?P<state>\d+))?', array(
            'methods'             => 'GET',
            'callback' => 'Proxy_Fnugg_Search_api',
            'args' => [
              'state'
            ],
            )
        );
    }
);

/**
 * Load date for autocomplete.
 *
 * @param array $data input data.
 *
 * @return array
 */
function Proxy_Fnugg_Autocomplete_api($data)
{
    $api_url = "https://api.fnugg.no/suggest/autocomplete/?q=";
    $fetch_url = $api_url;
    $state_id = $data['state'];
    $fetch_data = $state_id;

    if ($fetch_data) {
        $fetch_url .= '?' . $fetch_data;
    }

    $api_response = wp_remote_get($fetch_url);

    if (empty($api_response) || 200 !== $api_response['response']['code'] ) {

        return new WP_Error(
            'error',
            [
            'input'    => $data,
            'response' => $api_response,
            ]
        );
    }

    return new WP_REST_Response(json_decode($api_response['body']));
}

/**
 * Search data based on the resort name.
 *
 * @param array $data input data.
 *
 * @return array
 */
function Proxy_Fnugg_Search_api($data)
{
    $api_url = "https://api.fnugg.no/search?q=";
    $fetch_url = $api_url;
    $state_id = $data['state'];
    $fetch_data = $state_id;

    if ($fetch_data) {
        $fetch_url .= '?' . $fetch_data;
    }

    $api_response = wp_remote_get($fetch_url);

    if (empty($api_response) || 200 !== $api_response['response']['code'] ) {

        return new WP_Error(
            'error',
            [
            'input'    => $data,
            'response' => $api_response,
            ]
        );
    }

    return new WP_REST_Response(json_decode($api_response['body']));
}
