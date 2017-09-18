var path = require('path');
var webpack = require('webpack');

/*
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');
var pages = getPages('./src/{customer,doctor,test}/**/main.js'); // 获得入口js文件

function getPages(globPath) {
    var entries = {},
        plugins = [],
        basename,
        tmp,
        conf,
        pathname;

    glob.sync(globPath).forEach(function (entry) {
        tmp = entry.split('/').splice(-3);

        basename = tmp.splice(1, 1);//以文件名命名 path.basename(entry, path.extname(entry));
        pathname = basename + ''; // 正确输出js和html的路径

        entries[pathname] = ['babel-polyfill', path.resolve(__dirname, entry)];

        conf = {
            favicon: './src/assets/favicon.ico',
            filename: './' + pathname + '.html',
            template: './src/layout/main.html',   // 模板路径
            chunks: ['vendors', pathname],
            inject: true              // js插入位置
        };

        plugins.push(new HtmlWebpackPlugin(conf));
    });

    return {
        entries: entries,
        plugins: plugins
    }
}

process.noDeprecation = true;

module.exports = {
    entry: pages.entries,

    output: {
        path: path.join(__dirname, '../chronicd-server-web/'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        filename: 'js/[name].js',            //每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },

    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')]
    },

    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                exclude: /node_modules|web.config.js/,
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // vue-loader options go here
                    postcss: [
                        require('autoprefixer')()
                    ]
                },
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                //配置less的抽取器、加载器。中间!有必要解释一下，
                //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
                //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
                loader: 'style-loader!css-loader!postcss-loader!less-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules|web.config.js/
            },
            {
                test: /\.js$/,
                loader: 'file-loader',
                include: /web.config.js/,
                query: {
                    name: 'js/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[ext]?[hash]'
                }
            }
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: '#eval-source-map',

    plugins: pages.plugins
};

if (process.env.NODE_ENV === 'production') {
    module.exports.output.filename = 'js/[name].[chunkhash:5].js';

    module.exports.devtool = '#source-map';

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
            // chunks: ['page1', 'page2', 'page3'], //提取哪些模块共有的部分
            // minChunks: 13 // 提取至少3个模块共有的部分
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
} else {
    module.exports.devServer.proxy = [
        {
            target: 'https://test.healthd-consult.healthdoc.cn',
            context: ['/chronicd-server-api/v1/**'],
            secure: false,
            changeOrigin: true

        }
    ];
}