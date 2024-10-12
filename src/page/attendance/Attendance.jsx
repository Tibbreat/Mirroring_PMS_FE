import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Table, Avatar } from 'antd';
import * as faceapi from 'face-api.js';
import { useParams } from 'react-router-dom';
import { getChildrenByClassWithoutPaginationAPI } from '../../services/service.children';

const Attendance = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [labeledDescriptors, setLabeledDescriptors] = useState([]);
    const [children, setChildren] = useState([]);  // Dữ liệu từ API
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { id } = useParams();

    // Tải các mô hình face-api.js
    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
                setModelsLoaded(true);
                message.success('Hệ thống sẵn sàng để điểm danh!');
            } catch (error) {
                console.error('Error loading models:', error);
                message.error('Failed to load models');
            }
        };
        const loadChildren = async () => {
            try {
                const response = await getChildrenByClassWithoutPaginationAPI(id);
                const childrenWithAttendance = response.data.map(child => ({
                    ...child,
                    attendanceStatus: false // Thêm trạng thái điểm danh ban đầu
                }));
                setChildren(childrenWithAttendance);  // Lưu dữ liệu trẻ em vào state
            } catch (error) {
                console.error('Failed to fetch children:', error);
            }
        };
        loadChildren();
        loadModels();
    }, [id]);

    // Cột cho bảng dữ liệu
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageLink',
            key: 'imageLink',
            render: (text) => <Avatar width={100} src={text} />, 
        },
        {
            title: 'Tên trẻ',
            dataIndex: 'childName',
            key: 'childName',
        },
        {
            title: 'Tuổi',
            dataIndex: 'childAge',
            key: 'childAge',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'childBirthDate',
            key: 'childBirthDate',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'childAddress',
            key: 'childAddress',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'attendanceStatus',
            key: 'attendanceStatus',
            render: (attendanceStatus) => attendanceStatus ? 'Đã điểm danh' : 'Chưa điểm danh',
        }
    ];

    // Tạo mô hình nhận diện từ các ảnh trong folder
    const loadLabeledImages = async () => {
        const labels = children.map(child => child.childName);  // Sử dụng tên của trẻ từ API
        return Promise.all(
            labels.map(async (label) => {
                const imgUrl = children.find(child => child.childName === label).imageLink;  // Lấy ảnh từ API
                const img = await faceapi.fetchImage(imgUrl);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                if (!detections) {
                    throw new Error(`No faces detected in ${label}`);
                }
                const faceDescriptor = detections.descriptor;
                return new faceapi.LabeledFaceDescriptors(label, [faceDescriptor]);
            })
        );
    };

    useEffect(() => {
        const initializeFaceRecognition = async () => {
            try {
                const descriptors = await loadLabeledImages();
                setLabeledDescriptors(descriptors);
            } catch (error) {
                console.error('Error loading labeled images:', error);
            }
        };
        if (modelsLoaded) {
            initializeFaceRecognition();
        }
    }, [modelsLoaded, children]);

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

    // Phát hiện khuôn mặt và so sánh với các ảnh trong folder
    const detectFaces = async () => {
        if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
            });

            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            const context = canvasRef.current.getContext('2d');
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // So sánh khuôn mặt phát hiện với các mô hình đã lưu
            if (labeledDescriptors.length > 0) {
                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);
                resizedDetections.forEach(detection => {
                    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                    const matchedChild = children.find(child => child.childName === bestMatch.label);
                    
                    if (matchedChild) {
                        const currentTime = new Date().toLocaleString();
                        console.log(`Tên: ${matchedChild.childName}, ID: ${matchedChild.id}, Thời gian: ${currentTime}`);

                        setChildren(prevChildren =>
                            prevChildren.map(child =>
                                child.id === matchedChild.id ? { ...child, attendanceStatus: true } : child
                            )
                        );
                    }

                    const box = detection.detection.box;
                    const text = bestMatch.toString();
                    context.beginPath();
                    context.rect(box.x, box.y, box.width, box.height);
                    context.strokeStyle = 'green';
                    context.stroke();
                    context.fillStyle = 'green';
                    context.font = 'bold 16px Arial'; // Đặt font chữ đậm và kích cỡ to hơn
                    context.fillText(text, box.x, box.y - 10);
                });
            }

            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
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
            {/* Hiển thị bảng dữ liệu trẻ em */}
            <Table dataSource={children} columns={columns} rowKey="id" />

            <Button type="primary" onClick={handleButtonClick}>
                Điểm danh bằng webcam
            </Button>

            <Modal
                title="Webcam"
                open={isModalVisible}
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
