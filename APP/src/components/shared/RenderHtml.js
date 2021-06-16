import React, { useState, useMemo } from 'react';
import truncate from 'truncate-html';

const RenderHtml = ({ text, Component, length = 150, isEllipsis = true, ...rest }) => {

    const [isTruncated, setTruncated] = useState(false);

    const textTruncated = useMemo(() => {
        if (!isTruncated) {
            const truncated = truncate(text, length, { byWords: true });
            setTruncated(truncated.length === text.length);
            return truncated;
        }
        return truncate(text);
    }, [isTruncated, text]);

    const toggleLines = () => {
        setTruncated(!isTruncated);
    }

    return (
        <div>
            <Component {...rest} value={textTruncated} />
            {isEllipsis && !isTruncated && (<p className="pointer text-primary ml-3" onClick={toggleLines}>Read More</p>)}
        </div>
    );
};

export default React.memo(RenderHtml);