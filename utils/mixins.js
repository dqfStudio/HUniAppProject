import config from '@/utils/config.js';
let baseMixins = {
    methods: {
        // 当没有图片返回默认图片 url 资源路径
        getImageUrl(url = '') {
            if (url.indexOf('.html') >= 0) return config.util.ImgDefault;
            return url || config.util.ImgDefault;
        },
        /**
         * 获取图片资源-解决异步问题
         * @param {Object} imgData 图片数据源对象
         * @param {String} key 图片数据源对应key
         */
        requestImageUrl(imgData = {}, key = 'image') {
            if (imgData && imgData[key] && imgData[key].indexOf('.html') >= 0) {
                // 获取图片地址
                config.util.getImage(imgData[key]).then(data => {
                    imgData[key] = data;
                });
            }
        },
    }
}

export default baseMixins;