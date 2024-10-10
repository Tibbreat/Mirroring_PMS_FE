import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import * as faceapi from 'face-api.js';

const Attendance = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Tải các mô hình face-api.js
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                // await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                setModelsLoaded(true);
                message.success('Models loaded successfully!');
            } catch (error) {
                console.error('Error loading models:', error);
                message.error('Failed to load models');
            }
        };
        loadModels();
    }, []);

    // Bắt đầu stream webcam và tự động phát hiện khuôn mặt
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    // Phát hiện khuôn mặt và vẽ hình chữ nhật
    const detectFaces = async () => {
        if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            console.log('Detections:', detections); 
            const resizedDetections = faceapi.resizeResults(detections, {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
            });
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            const context = canvasRef.current.getContext('2d');
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        }
    };

    useEffect(() => {
        if (isModalVisible && modelsLoaded) {
            startWebcam();
        } else {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        }
    }, [isModalVisible, modelsLoaded]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoStream && modelsLoaded) {
                detectFaces();
            }
        }, 100);
        return () => clearInterval(interval);
    }, [videoStream, modelsLoaded]);

    const handleButtonClick = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Button type="primary" onClick={handleButtonClick}>Điểm danh</Button>
            <Modal
                title="Webcam"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{ width: '100%', maxHeight: '500px' }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Attendance;