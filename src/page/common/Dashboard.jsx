import SupportBtn from "../../component/SupportBtn";

const Dashboard = () => {


    return (
        <div className="container d-flex welcome-screen">
            <div className="col-9 d-flex flex-column justify-content-center align-items-center">
                <p className="welcome-title col-10">Chào mừng đến với hệ thống quản lý PMS</p>
                <p className="welcome-sub-title col-8">mail...</p>
                <div className="col-8">
                    <div className="ele-1 d-flex mt-4">
                        <div className="col-1">
                            <img className="ele-icon" src="/icon/profile-add.svg" alt="" />
                        </div>
                        <div className="col-11">
                            <p className="ele-title fw-bold">Thêm tài khoản cho các nhân viên trong trường</p>
                            <p className="ele-sub-title">Bạn có thể thêm tài khoản cho các nhân viên như quản lý lớp, quản lý nhà bếp, quản lý vận chuyển... để dễ dàng giám sát các hoạt động của trường.</p>
                        </div>
                    </div>
                    <div className="ele-1 d-flex mt-4">
                        <div className="col-1">
                            <img className="ele-icon" src="/icon/bank.svg" alt="" />
                        </div>
                        <div className="col-11">
                            <p className="ele-title fw-bold">Thêm các lớp học</p>
                            <p className="ele-sub-title">Tạo các lớp học để dễ dàng quản lý các hoạt động của lớp..</p>
                        </div>
                    </div>
                    <div className="ele-1 d-flex mt-4">
                        <div className="col-1">
                            <img className="" src="/icon/education.svg" alt="" />
                        </div>
                        <div className="col-11">
                            <p className="ele-title fw-bold">Thêm thông tin trẻ theo lớp</p>
                            <p className="ele-sub-title">Thêm thông tin trẻ theo lứa tuổi, dễ dàng quản lý thông tin cá nhân của trẻ.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-3 d-flex flex-column ">
                <div className="mt-auto">
                    <SupportBtn />
                </div>

            </div>

        </div>
    )
}

export default Dashboard;