import { Link } from "react-router-dom";
import { Pagination, Tag } from "antd";

const TeacherTable = ({ data, currentPage, total, setCurrentPage }) => {
    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page when the page changes
    };

    return (
        <div className="col-11 p-2">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Tên đầy đủ</th>
                        <th scope="col">Account</th>
                        <th scope="col">Email</th>
                        <th scope="col">Lớp phụ trách</th>
                        <th scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((teacher) => (
                        <tr key={teacher.id}>
                            <td>
                                <Link to={`/pms/manage/teacher/${teacher.id}`} className="text-blue-2">
                                    {teacher.fullName}
                                </Link>
                            </td>
                            <td>{teacher.username}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.phone || "N/A"}</td>
                            <td>
                                <Tag color={teacher.isActive ? 'green' : 'red'}>
                                    {teacher.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                </Tag>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                align="end"
                current={currentPage}
                pageSize={10}
                total={total}
                showSizeChanger={false}
                onChange={handlePageChange} // Handle page changes
            />
        </div>
    );
}

export default TeacherTable;
