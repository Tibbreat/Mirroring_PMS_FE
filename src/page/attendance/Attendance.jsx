import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Modal, Table, Avatar, notification, Image, Card, Row, Col, Select, DatePicker, message } from 'antd';
import * as faceapi from 'face-api.js';
import { useParams } from 'react-router-dom';
import { createBaseLogAPI } from '../../services/service.log';
import { AuthContext } from '../../component/context/auth.context';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const Attendance = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [labeledDescriptors, setLabeledDescriptors] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const loadChildren = async () => {
        try {
            const response = await createBaseLogAPI(id, selectedDate.format('YYYY-MM-DD'));
            setChildren(response.data);
        } catch (error) {
            console.error('Failed to fetch children:', error);
        }
    };

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

        loadModels();
    }, [id]);

    useEffect(() => {
        loadChildren();
    }, [selectedDate]);
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => <Image width={100} src={text} />,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'childName',
            key: 'childName',
        },
        {
            title: 'Thời gian đi học',
            dataIndex: 'checkinTime',
            key: 'checkinTime',
            render: (text) => text || 'Chưa điểm danh',
        },
        {
            title: 'Thời gian về nhà',
            dataIndex: 'checkoutTime',
            key: 'checkoutTime',
            render: (text) => text || 'Chưa điểm danh',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => {
                if (!record.checkinTime) {
                    return (
                        <Button type="primary" onClick={() => handleCheckIn(record.id)}> Check-in </Button>
                    );
                } else if (record.checkinTime && !record.checkoutTime) {
                    return (
                        <Button type="danger" onClick={() => handleCheckOut(record.id)}> Check-out </Button>
                    );
                } else {
                    return null;
                }
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text) => (
                <span>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewNote(text)} >
                    </Button>
                </span>
            ),
        },
    ];

    const handleCheckIn = (id) => {
        const currentTime = new Date().toLocaleString();
    };

    const handleCheckOut = (id) => {
        const currentTime = new Date().toLocaleString();
    };

    const loadLabeledImages = async () => {
        const labels = children.map(child => child.childName);
        return Promise.all(
            labels.map(async (label) => {
                const imgUrl = children.find(child => child.childName === label).imageUrl;
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

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            message.success('Đã mở camera. Hãy đợi một chút để hệ thống nhận diện khuôn mặt.');
        } catch (error) {
            console.error('Không thể truy cập camera:', error);
            notification.error({
                message: 'Lỗi truy cập camera',
                description: 'Không thể mở camera trên iPad. Vui lòng kiểm tra quyền truy cập hoặc thử trên Safari.',
            });
        }
    };


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

            if (labeledDescriptors.length > 0) {
                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4);
                resizedDetections.forEach(detection => {
                    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                    const matchedChild = children.find(child => child.childName === bestMatch.label);

                    if (matchedChild && !matchedChild.attendanceStatus) {
                        const currentTime = new Date().toLocaleString();
                        setChildren(prevChildren =>
                            prevChildren.map(child =>
                                child.id === matchedChild.id ? { ...child, attendanceStatus: true } : child
                            )
                        );
                        notification.success({
                            message: 'Điểm danh thành công',
                            description: `Đã điểm danh cho ${matchedChild.childName} (ID: ${matchedChild.id}) vào lúc ${currentTime}`,
                        });
                    }

                    const box = detection.detection.box;
                    const text = bestMatch.toString();
                    context.beginPath();
                    context.rect(box.x, box.y, box.width, box.height);
                    context.strokeStyle = 'green';
                    context.stroke();
                    context.fillStyle = 'green';
                    context.font = 'bold 16px Arial';
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
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
    };

    const handleDateChange = (date) => { setSelectedDate(date); };


    return (
        <Card className='m-2'>
            <Row gutter={[16, 16]} className='mb-2'>
                <Col span={12}>
                    <DatePicker
                        placeholder="Ngày"
                        style={{ width: '50%' }}
                        value={selectedDate}
                        onChange={handleDateChange}
                        disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="link" onClick={handleButtonClick}>
                        Điểm danh bằng webcam
                    </Button>
                </Col>
            </Row>

            <Table dataSource={children}
                columns={columns}
                rowKey="id"
                pagination={false} />

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
        </Card>
    );
};

export default Attendance;