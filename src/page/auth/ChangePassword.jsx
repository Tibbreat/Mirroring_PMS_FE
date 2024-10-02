import React from 'react'

const ChangePassword = () => {
    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100" >
            <div className='login'>
                <div className="login-title text-center mb-4">
                    <div className="login-title-first display-6 fw-bold">Đổi mật khẩu</div>
                </div>
                <form className='login-form-body'>

                    <div className="login-form-input d-flex flex-column justify-content-center align-items-center">
                        <div className='login-sub-title mt-5'>
                            <p>Vui lòng nhập mã xác minh đã được gửi về e-mail</p>
                        </div>
                        <div className='form-input mt-3'>
                            <input
                                className='form-control input-1 mt-3'
                                type="text"
                                name="code"
                                placeholder="Mã xác minh"
                            />
                        </div>
                        <div className='form-input'>
                            <input
                                className='form-control input-1 mt-3'
                                type="text"
                                id="username"
                                name="password"
                                placeholder="Mật khẩu mới"
                            />
                        </div>
                        <div className='form-input'>
                            <input
                                className='form-control input-1 mt-3'
                                type="password"
                                id="password"
                                name="re-password"
                                placeholder="Xác nhận lại mật khẩu mới"
                            />
                        </div>
                    </div>
                    <div className='login-form-btn d-flex justify-content-center mt-3' >
                        <button className='btn btn-blue-1 ' type='submit'>Đổi mật khẩu</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ChangePassword