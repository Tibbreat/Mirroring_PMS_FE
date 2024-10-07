const SupportBtn = () => {
    return (
        <button className="btn-support d-flex btn align-items-center">
            <div className="col-9 d-flex">
                <div className="col-3">
                    <img src="/icon/support.svg" alt="" />
                </div>
                <div className="col-9">
                    Hỗ trợ
                </div>
            </div>
            <div className="col-3">
                <img src="/icon/chevron-down.svg" alt="" />
            </div>
        </button>
    )
}

export default SupportBtn