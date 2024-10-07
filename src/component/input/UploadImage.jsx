import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';

const UploadImage = ({ onImageChange }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null); // Create a ref for the input file element

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
                onImageChange(file); // Pass the selected file to the parent component
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {imageUrl && (
                    <div className="text-center mt-4">
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                )}
                <div className="col-md-6 offset-md-3">
                    <div className="mb-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button icon={<UploadOutlined />} onClick={triggerFileInput}>
                            Chọn ảnh
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
