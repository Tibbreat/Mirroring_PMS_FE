import React from 'react';
import { Spin } from 'antd';

const Loading = () => {
    return (
        <div className="loading-container d-flex justify-content-center align-items-center vh-100">
            <Spin size="large" />
        </div>
    );
};

export default Loading;