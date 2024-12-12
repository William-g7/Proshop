import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../slices/orderApiSlice';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

const OrderScreen = () => {
    const { id } = useParams();
    const { data: order, isLoading, error } = useGetOrderByIdQuery(id);

    return <div>OrderScreen</div>;
};

export default OrderScreen;