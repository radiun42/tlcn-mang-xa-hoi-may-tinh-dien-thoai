import React from 'react';

const ImagePost = ({ imageUrls }) => {
    const displayOneImage = () => {
        return (
            <a className="cursor-pointer">
                <img src={imageUrls[0]} alt="post-image" className="img-fluid rounded w-100" />
            </a>
        );
    };

    const displayTwoImages = () => {
        return (
            <div className="d-flex">
                <div className="col-md-6">
                    <a className="cursor-pointer">
                        <img src={imageUrls[0]} alt="post-image" className="img-fluid rounded w-100" />
                    </a>
                </div>
                <div className="col-md-6 row m-0 p-0">
                    <a className="cursor-pointer">
                        <img src={imageUrls[1]} alt="post-image" className="img-fluid rounded w-100" />
                    </a>
                </div>
            </div>
        );
    };

    const displayThreeImages = () => {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <a className="cursor-pointer">
                            <img src={imageUrls[0]} alt="post-image" className="img-fluid rounded w-100" />
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6 mt-3">
                        <a className="cursor-pointer" alt="post-image" className="img-fluid rounded w-100"></a>
                    </div>
                    <div className="col-sm-6 mt-3">
                        <a className="cursor-pointer"><img src={imageUrls[2]} alt="post-image" className="img-fluid rounded w-100" /></a>
                    </div>
                </div>
            </div >
        );
    };

    const displayMoreImages = () => {
        return (
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <a className="cursor-pointer">
                            <img src={imageUrls[0]} alt="post-image" className="img-fluid rounded w-100" />
                        </a>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6 mt-3">
                        <a className="cursor-pointer"><img src={imageUrls[1]} alt="post-image" className="img-fluid rounded w-100" /></a>
                    </div>
                    <div className="col-sm-6 mt-3">
                        <a className="cursor-pointer">
                            <img src={imageUrls[2]} alt="post-image"
                                className="img-fluid rounded w-100 image-darken" />
                            <h1 className="text-light text-overlay-image m-0">+{imageUrls.length - 3}</h1>
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    const displayImages = () => {
        switch (imageUrls.length) {
            case 1:
                return displayOneImage();
            case 2:
                return displayTwoImages();
            case 3:
                return displayThreeImages();
            default:
                return displayMoreImages();
        }
    }

    return imageUrls && imageUrls.length > 0 && displayImages();
};

export default ImagePost;