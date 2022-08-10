/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
// import { useState } from "@wordpress/element";
import { __ } from '@wordpress/i18n';
import { Button, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { ReactComponent as Cloud } from './images/cloud.svg';
import { ReactComponent as Navigation } from './images/navigation.svg';
import { ReactComponent as Road } from './images/road.svg';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	useBlockProps,
	RichText,
	BlockControls,
} from '@wordpress/block-editor';

/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
 */

import apiFetch from '@wordpress/api-fetch';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const isSourceAvailable = typeof attributes.resort_details !== 'undefined';
	const blockProps = useBlockProps();

	const AUTOCOMPLETE_END_POINT = 'ski/v1/autocomplete';
	const SEARCH_END_POINT = 'ski/v1/search';

	// Autocomplete component
	const autoConfigs = [
		{
			name: 'autocomplete',
			// The prefix that triggers this completer
			triggerPrefix: '/',
			className: 'editor-autocompleters',
			// The option data
			async options( search ) {
				let selectedFilterState = '';
				if ( search ) {
					selectedFilterState = search;
				}
				let fetchURL = AUTOCOMPLETE_END_POINT;
				fetchURL = `${ AUTOCOMPLETE_END_POINT }?state=${ selectedFilterState }`;
				const responses = await apiFetch( { path: fetchURL } );
				const result = responses.result;
				return result;
			},
			isDebounced: true,
			getOptionLabel: ( option ) => <span>{ option.name }</span>,
			// Declares that options should be matched by their name or value
			getOptionKeywords: ( option ) => [ option.name, option.name ],
			// Declares that the Grapes option is disabled
			getOptionCompletion: ( option ) => option.name,
		},
	];

	// Search data based on the name
	const updateData = async ( name ) => {
		const payload = name;
		let fetchURL = SEARCH_END_POINT;
		fetchURL = `${ SEARCH_END_POINT }?state=${ payload }`;
		const response = await apiFetch( { path: fetchURL } );
		setAttributes( { resort_details: response.hits.hits[ 0 ]._source } );
	};

	const { resort_details } = attributes;
	const { images, contact, conditions, last_updated } = resort_details
		? resort_details
		: '';
	const { current_report } = conditions ? conditions : '';
	const { top } = current_report ? current_report : '';
	const updatedDate = last_updated ? last_updated : '';
	const date = updatedDate ? new Date( updatedDate ).toUTCString() : '';

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					{ isSourceAvailable && (
						<ToolbarButton
							showTooltip
							icon="edit"
							onClick={ updateData }
							label={ __( 'Try another image', 'ski-resort' ) }
						/>
					) }
				</ToolbarGroup>
			</BlockControls>
			{ isSourceAvailable && (
				<div className="ski-resort-custom-block">
					<div className="ski-resort-card">
						<div className="ski-resort-card-top-section">
							<h3 className="ski-resort-card-header-name">
								{ resort_details.name }
							</h3>
							<img
								src={ images.image_full }
								alt={ __( 'resort-cover', 'ski-resort' ) }
							/>
							<div className="ski-resort-overlay-text">
								<p className="ski-resort-overlay-text-header">
									{ __( 'Dagens Forhold', 'ski-resort' ) }
								</p>
								<p className="ski-resort-overlay-text-desc">
									{ __( 'Oppdatert:', 'ski-resort' ) }{ ' ' }
									{ date }
								</p>
							</div>
						</div>
						<div className="ski-resort-card-bottom-section">
							<div className="ski-resort-weather-section-left">
								<Cloud />
								<p>{ top.condition_description }</p>
							</div>
							<p className="ski-resort-weather-section-right">
								{ top.temperature.value }°
							</p>
							<div className="ski-resort-navigation-section-left">
								<div>
									<Navigation />
									<p>{ contact.city }</p>
								</div>
								<p>{ contact.address }</p>
							</div>
							<div className="ski-resort-navigation-section-right">
								<Road />
								<p>{ resort_details.region[ 0 ] }</p>
							</div>
						</div>
					</div>
				</div>
			) }
			{ ! isSourceAvailable && (
				<>
					<RichText
						autocompleters={ autoConfigs }
						value={ attributes.value }
						data-test-id={ attributes.value }
						onChange={ ( newValue ) => {
							setAttributes( { value: newValue } );
						} }
						placeholder={ __(
							'Type / to choose a autocomplete',
							'ski-resort'
						) }
					/>
					<Button
						variant="primary"
						onClick={ updateData.bind( this, attributes.value ) }
					>
						{ __( 'Create block', 'ski-resort' ) }
					</Button>
				</>
			) }
		</div>
	);
}
