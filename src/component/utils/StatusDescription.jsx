import { Descriptions, Tag } from 'antd';

const StatusDescription = ({ status }) => {
    let color = '';
    let text = '';

    switch (status) {
        case 'NOT_STARTED':
            color = 'blue';
            text = 'Chưa bắt đầu';
            break;
        case 'IN_PROGRESS':
            color = 'green';
            text = 'Đang trong năm học';
            break;
        case 'COMPLETED':
            color = 'gray';
            text = 'Đã kết thúc';
            break;
        default:
            color = 'default';
            text = 'Không xác định';
    }

    return (

        <Tag color={color}>{text}</Tag>

    );
};

export default StatusDescription;
