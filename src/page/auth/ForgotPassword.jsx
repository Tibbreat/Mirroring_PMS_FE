import React from 'react'
const ForgotPassword = () => {
    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100" >
            <div className='forgot-password'>
                <div className="forgot-password-title text-center mb-4">
                    <div className="forgot-password-title-first display-6 fw-bold">Quên mật khẩu</div>
                </div>
                <form className='forgot-password-form-body'>

                    <div className="forgot-password-form-input d-flex flex-column justify-content-center align-items-center">
                        <div className='forgot-password-sub-title mt-5'>
                            <p>Vui lòng nhập account hoặc số điện thoại để nhận mã OTP</p>
                        </div>
                        <div className='form-input mt-3'>
                            <input
                                className='form-control input-1 mt-3'
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Account"
                            />
                        </div>
                    </div>
                    <div className='forgot-password-form-btn d-flex justify-content-center mt-3' >
                        <button className='btn btn-blue-1' type='submit'>Gửi mã</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ForgotPassword