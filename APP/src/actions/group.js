import {
    GET_GROUPS, GET_GROUP, GROUP_ERROR, CLEAR_GROUP, JOIN_GROUP, UNJOIN_GROUP,
    ADD_GROUP, RESET_GROUP, INVITE_GROUP, EDIT_GROUP
} from './types';
import axios from 'axios';
import urlAPI from '../utils/urlAPI';

export const getGroups = (skip = 0, limit = 5, name = '') => async dispatch => {
    try {
        const res = await axios.get(`${urlAPI}/api/groups?skip=${skip}&limit=${limit}&name=${name}`);

        dispatch({
            type: GET_GROUPS,
            payload: res.data,
            name
        });
    }
    catch (e) {
        console.log(e);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
};

const queryStringByTab = (tab) => {
    switch (tab) {
        case 0:
            return '&group=home';
        case 1:
            return '&group=joined';
        case 2:
        default:
            return '&group=discovery';
    }
}

export const getGroupsByTab = (skip = 0, limit = 5, name = '', tab = 0, callback) => async dispatch => {
    try {

        const res = await axios.get(`${urlAPI}/api/groups/me?skip=${skip}&limit=${limit}&name=${name}` + queryStringByTab(tab));

        dispatch({
            type: GET_GROUPS,
            payload: res.data?.groups,
            name
        });

        return callback(res.data?.length, res.data?.groups);
    }
    catch (e) {
        console.log(e);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
};

export const resetGroups = () => dispatch => {
    dispatch({
        type: RESET_GROUP
    });
};

export const getGroup = (id, history) => async dispatch => {
    try {
        dispatch({
            type: CLEAR_GROUP
        });

        const res = await axios.get(`${urlAPI}/api/groups/${id}`);

        dispatch({
            type: GET_GROUP,
            payload: res.data
        });
    }
    catch (e) {
        console.log(e);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })

        history.push('/notfound');
    }
};

export const joinGroup = (id) => async dispatch => {
    try {
        const res = await axios.put(`${urlAPI}/api/groups/${id}/join`);

        dispatch({
            type: JOIN_GROUP,
            payload: res.data,
            groupId: id
        });
    }
    catch (e) {
        console.log(e);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
};

export const unjoinGroup = (id) => async dispatch => {
    try {
        const res = await axios.put(`${urlAPI}/api/groups/${id}/unjoin`);

        dispatch({
            type: UNJOIN_GROUP,
            payload: res.data,
            groupId: id
        });
    }
    catch (e) {
        console.log(e);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
};

export const addGroup = (formData, handleAddGroup) => async dispatch => {
    try {
        const res = await axios.post(`${urlAPI}/api/groups`, formData);

        dispatch({
            type: ADD_GROUP,
            payload: res.data,
        });

        handleAddGroup('Successfully create a group.', true);
    }
    catch (e) {
        console.log(e);

        handleAddGroup('Failed create a group.', false);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
}

export const inviteGroup = (groupId, formData, handleAddGroup) => async dispatch => {
    try {

        const res = await axios.put(`${urlAPI}/api/groups/${groupId}/invite`, {
            users: formData
        });

        dispatch({
            type: INVITE_GROUP,
            payload: res.data,
        });

        handleAddGroup('Successfully invite a group.', true);
    }
    catch (e) {
        console.log(e);

        handleAddGroup('Failed invite a group.', false);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
}

export const editGroup = (id, formData, handleAddGroup) => async dispatch => {
    try {
        const res = await axios.put(`${urlAPI}/api/groups/${id}`, formData);

        const groupEdited = res.data;

        dispatch({
            type: EDIT_GROUP,
            payload: {
                name: groupEdited.name,
                info: groupEdited.info,
                isPublic: groupEdited.isPublic,
                wallpaper: groupEdited.wallpaper,
                avatar: groupEdited.avatar
            }
        });

        handleAddGroup('Successfully create a group.', true);
    }
    catch (e) {
        console.log(e);

        handleAddGroup('Failed create a group.', false);

        dispatch({
            type: GROUP_ERROR,
            payload: { msg: e.response.data, status: e.response.statusText }
        })
    }
};