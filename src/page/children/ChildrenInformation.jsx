import React, { useState, useEffect, useContext } from 'react';
import { Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { getChildDetailAPI } from '../../services/service.children';
import { ParentDetail } from './ParentDetail';
import { ChildrenDetail } from './ChildrenDetail';
import { ListClassDetail } from './ListClassDetail';
import { AuthContext } from '../../component/context/auth.context';

const ChildrenInformation = () => {
    const [childrenData, setChildrenData] = useState(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const fetchChildrenData = async (id) => {
        try {
            const response = await getChildDetailAPI(id);
            setChildrenData(response.data);
        } catch (error) {
            console.error('Error fetching children data:', error);
        }
    };

    useEffect(() => {
        fetchChildrenData(id);
    }, [id]);


    return (
        <div className="container">
            <Card className='m-2'>
                <ChildrenDetail
                    childrenData={childrenData}
                    id={id}
                    role={user.role} />
                <Divider />
                <ParentDetail data={childrenData}  role={user.role} />
                <Divider />
                <ListClassDetail id={id} />
            </Card>
        </div>
    );
};

export default ChildrenInformation;