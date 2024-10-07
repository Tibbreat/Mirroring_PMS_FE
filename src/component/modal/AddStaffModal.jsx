import { Modal } from "antd";

const AddStaffModal = ({ isModalOpen, handleCancel }) => {
    const handleOk = () => {
        
    }
    return (
        <>
            <Modal
                title="Thêm nhân viên"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            ></Modal>
        </>
    )
}
export default AddStaffModal;