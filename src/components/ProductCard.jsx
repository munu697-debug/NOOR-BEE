import React from 'react';
import './ProductCard.css';

const ProductCard = ({ image, title, subline, price }) => {
    return (
        <div className="product-card">
            <div className="product-image-container glass">
                <img src={image} alt={title} className="product-image" loading="lazy" />
                <div className="product-shadow"></div>
            </div>
            <div className="product-info">
                <h3 className="product-title">{title}</h3>
                <p className="product-subline">{subline}</p>
                <div className="product-footer">
                    <span className="product-price">${price}</span>
                    <button className="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
