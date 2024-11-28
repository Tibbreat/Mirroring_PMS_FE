import { UserOutlined } from "@ant-design/icons";
import { Table, Avatar, Tag, Button, Modal, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChildrenByClassAPI, transferClass } from "../../services/service.children";
import dayjs from "dayjs";
import { getClassListToTransfer } from "../../services/services.class";

export const ChildrenOfClassTable = ({ id }) => {
    const [data, setData] = useState([]);
    const [classList, setClassList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedChildren, setSelectedChildren] = useState();
    
    const fetchChildrenList = useCallback(async () => {
        try {
            const response = await getChildrenByClassAPI(id);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching children :', error);
        }
    }, [id]);

    const fetchClasses = async (childrenId) => {
        const today = dayjs();
        const currentYear = today.year();
        const nextYear = currentYear + 1;
        const academicYear = `${currentYear}-${nextYear}`;
        try {
            const response = await getClassListToTransfer(academicYear, childrenId);
            setClassList(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách lớp');
        }
    };

    const showModal = (record) => {
        setIsModalVisible(true);
        setSelectedChildren(record);
        fetchClasses(record.id);
    };

    useEffect(() => {
        fetchChildrenList();
    }, []);


    const availableClasses = [
        { title: 'Lớp', dataIndex: 'className', key: 'className' },
        { title: 'Giáo viên', dataIndex: 'teacherName', key: 'teacherName' },
        { title: 'Lứa tuổi', dataIndex: 'ageRange', key: 'ageRange', render: (ageRange) => `${ageRange} tuổi` },
        { title: 'Sĩ số hiện tại', dataIndex: 'countStudent', key: 'countStudent', align: 'center' },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (record) => (
                <Button type="link" onClick={() => confirmChangeClass(record, selectedChildren)}>Chuyển</Button>
            ),
        },
    ];

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'avatar',
            key: 'avatar',
            align: 'center',
            render: (url) => url ? <Avatar width={50} src={url} /> : <Avatar size="small" icon={<UserOutlined />} />,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'childName',
            key: 'childName',
            render: (text, record) => (
                <Link to={`/pms/manage/children/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => text === 'male' ? 'Nam' : text === 'female' ? 'Nữ' : text,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'childBirth',
            key: 'childBirth',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Đăng ký bán trú',
            dataIndex: 'registeredForBoarding',
            key: 'registeredForBoarding',
            align: 'center',
            render: (value) => (
                <Tag color={value ? "green" : "red"}>
                    {value ? "Có" : "Không"}
                </Tag>
            ),
        },
        {
            title: 'Đăng ký đưa đón',
            dataIndex: 'registeredForTransport',
            key: 'registeredForTransport',
            align: 'center',
            render: (value) => (
                <Tag color={value ? "green" : "red"}>
                    {value ? "Có" : "Không"}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (record) => (
                <Button type="link" onClick={() => showModal(record)}>Chuyển lớp</Button>
            ),
        }
    ];

    const confirmChangeClass = (selected, selectedChildren) => {
        Modal.confirm({
            title: 'Xác nhận chuyển lớp',
            content: `Bạn có chắc chắn muốn chuyển bé ${selectedChildren.childName} sang lớp ${selected.className}?`,
            okText: 'Chuyển Lớp',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    console.log("Old class id: " + id);
                    console.log("New class: ", selected.className + " - " + selected.id);
                    console.log("Student: ", selectedChildren.childName + " - " + selectedChildren.id);

                    await transferClass(selectedChildren.id, id, selected.id);
                    message.success(`Đã chuyển thành công bé ${selectedChildren.childName} sang lớp ${selected.className}`);
                    setIsModalVisible(false);
                    fetchChildrenList(); 
                } catch (error) {
                    console.error('Error transferring class:', error);
                    message.error("Chuyển lớp thất bại");
                }
            },
        });
    };
    return (
        <div className="p-2">
            <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={
                    {
                        pageSize: 10,
                        showSizeChanger: false,
                    }
                }
                rowKey="id"
                bordered
            />
            <Modal
                title="Danh sách lớp có thể chuyển"
                open={isModalVisible}
                width={800}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
            >
                <Table
                    dataSource={classList}
                    columns={availableClasses}
                    pagination={false}
                    bordered />
            </Modal>
        </div>
    );
};