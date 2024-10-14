import { notification } from "antd";
import * as faceapi from 'face-api.js';
export const loadModels = async () => {
    try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        notification.success({
            message: 'Hệ thống sẵn sàng!',
            description: 'Hệ thống đã sẵn sàng để điểm danh.',
        });
    } catch (error) {
        console.error('Error loading models:', error);
        notification.error({
            message: 'Lỗi',
            description: 'Không thể tải các mô hình.',
        });
    }
};