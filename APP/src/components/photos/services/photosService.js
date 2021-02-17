import axios from 'axios';
import urlAPI from '../../../utils/urlAPI';

export const getPhotos = async () => {
    try {
        const res = await axios.get(`${urlAPI}/api/photos`);

        return res.data;
    }
    catch (e) {
        console.log(e);
    }
};