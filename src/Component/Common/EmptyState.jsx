import React from "react";
export default function EmptyState({ icon, title, description }) {
    return (
        <div className="tab-content">
            <div className="empty-state">
                <div className="empty-icon" role="img" aria-label={title}>
                    {icon}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}
