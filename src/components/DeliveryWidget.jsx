import React from 'react';
import './DeliveryWidget.css';
import { MapPin } from 'lucide-react';

const DeliveryWidget = () => {
    return (
        <div className="delivery-widget glass">
            <div className="delivery-header">
                <MapPin className="text-gold" size={24} />
                <h4>Check Delivery Time</h4>
            </div>
            <p className="delivery-desc">Enter your pincode for estimated delivery dates arriving to your location.</p>
            <form className="delivery-form" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Enter Pincode" className="pincode-input" maxLength={6} />
                <button type="submit" className="check-btn">Check</button>
            </form>
        </div>
    );
};

export default DeliveryWidget;
