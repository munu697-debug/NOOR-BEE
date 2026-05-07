import React from 'react';
import { Truck, ShieldCheck, BadgeDollarSign, MessagesSquare, CheckCircle } from 'lucide-react';
import './TrustSection.css';

const TrustSection = () => {
    // We use exactly 4 main items (as shown in the user's screenshot map)
    const trustItems = [
        { id: 1, icon: <CheckCircle size={36} strokeWidth={1.2} />, title: '100% Genuine', sub: 'Authentic quality products' },
        { id: 2, icon: <ShieldCheck size={36} strokeWidth={1.2} />, title: 'Secure Payment', sub: 'Encrypted safe checkout' },
        { id: 3, icon: <Truck size={36} strokeWidth={1.2} />, title: 'Free Shipping', sub: 'On all orders over ₹999' },
        { id: 4, icon: <MessagesSquare size={36} strokeWidth={1.2} />, title: 'Online Support', sub: '24/7 dedicated support' },
    ];

    // Duplicate arrays to create a seamless infinite CSS sliding marquee
    const duplicatedItems = [...trustItems, ...trustItems, ...trustItems];

    return (
        <section className="trust-banner-container">
            <div className="trust-marquee">
                <div className="trust-marquee-track">
                    {duplicatedItems.map((item, index) => (
                        <div className="trust-item" key={index}>
                            <div className="trust-icon">{item.icon}</div>
                            <div className="trust-text">
                                <h4>{item.title}</h4>
                                <p>{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
