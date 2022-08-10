import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ReactComponent as Cloud } from './images/cloud.svg';
import { ReactComponent as Navigation } from './images/navigation.svg';
import { ReactComponent as Road } from './images/road.svg';

export default function save( { attributes } ) {
	const { resort_details } = attributes;
	const { images, contact, conditions, last_updated } = resort_details
		? resort_details
		: '';
	const { current_report } = conditions ? conditions : '';
	const { top } = current_report ? current_report : '';
	const updatedDate = last_updated ? last_updated : '';
	const date = updatedDate ? new Date( updatedDate ).toUTCString() : '';

	return (
		<div className="ski-resort-custom-block" { ...useBlockProps.save() }>
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
							{ __( 'Oppdatert:', 'ski-resort' ) } { date }
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
	);
}
