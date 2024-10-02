const NoData = ({title, subTitle}) => {
    return (
        <div className="no-teachers col-8 d-flex flex-column ">
            <div className="kua d-flex justify-content-center">
                <img src="/icon/kua.svg" alt="" />
            </div>
            <div className="no-teacher-title mt-auto">
                {title}
            </div>
            <div className="no-teacher-sub-title mb-5">
                {subTitle}
            </div>
        </div>
    );
}

export default NoData;