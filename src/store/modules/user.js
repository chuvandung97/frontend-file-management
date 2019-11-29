export const moduleUser = {
    
    state: {
        id: null,
        name: null,
        email: null
    },
    mutations: {
        setUser(state, payload) {
            localStorage.setItem('userid', payload.id)
            localStorage.setItem('username', payload.name)
            localStorage.setItem('useremail', payload.email)
            localStorage.setItem('userrole', payload.role)
        },
    },
    actions: {},
    
}