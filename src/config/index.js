const EnvConfig = {
    development: {
        baseApi: '/api',
        mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    },
    prod: {
        baseApi: '//future.com/api',
        mockApi: 'https://apifoxmock.com/m1/4068509-0-default/api'
    }
}


const env = import.meta.env.MODE || 'prod'
export default {
    env,
    ...EnvConfig[env],
    // mock 开关
    mock: false,
}