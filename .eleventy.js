const path = require("path");
const util = require("util");
const fs = require("fs");

const eleventyImage = require("@11ty/eleventy-img");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");
const codeClipboard = require("eleventy-plugin-code-clipboard");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const spacetime = require("spacetime");

const heroGen = require("./lib/post-hero-gen.js");
const site = require("./src/_data/site");

module.exports = function(eleventyConfig) {
    eleventyConfig.setUseGitIgnore(true); // otherwise docs and handbook are ignored

    // Layout aliases
    eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
    eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
    eleventyConfig.addLayoutAlias('nohero', 'layouts/nohero.njk');
    eleventyConfig.addLayoutAlias('redirect', 'layouts/redirect.njk');
    
    // Copy the contents of the `public` folder to the output folder
    eleventyConfig.addPassthroughCopy({
        "src/public/": "/",
    });

    // Watch content images for the image pipeline
    eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");

    // Custom filters
    eleventyConfig.addFilter("head", (array, n) => {
        if( n < 0 ) {
            return array.slice(n);
        }
        return array.slice(0, n);
    });

    eleventyConfig.addFilter('console', function(value) {
        const str = util.inspect(value, {showHidden: false, depth: null});
        return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
    });

    eleventyConfig.addFilter('shortDate', dateObj => {
        return spacetime(dateObj).format('{date} {month-short}, {year}')
    });

    eleventyConfig.addFilter('duration', mins => {
        if (mins > 60) {
            const hrs = Math.floor(mins/60)
            return `${hrs}h ${mins%60}m`
        }
        else {
            return `${mins} mins`
        }
    });

    eleventyConfig.addFilter('inFuture', (posts) => {
        // filter posts/webinars that only occurred in the past
        if (posts) {
            return posts.filter((post) => {
                const postDate = spacetime(post.data.date)
                return postDate.isAfter(spacetime.today()) || postDate.isSame(spacetime.today(), 'day')
            })
        } else {
            return null
        }
    });

    eleventyConfig.addFilter('inPast', (posts) => {
        // filter posts/webinars that only occured in the past
        return posts.filter((post) => {
            const postDate = spacetime(post.data.date)
            return postDate.isBefore(spacetime.today())
        })
    });

    eleventyConfig.addFilter('dateInFuture', (date) => {
        // return true is the provided date is in the past, otherwise, return false
        const postDate = spacetime(date)
        return postDate.isAfter(spacetime.today()) || postDate.isSame(spacetime.today())
    });

    eleventyConfig.addFilter('countDays', (date) => {
        // return true is the provided date is in the past, otherwise, return false
        const postDate = spacetime(date)
        const now = spacetime.now().startOf('day')
        const days = now.diff(postDate, 'day') + 1
        if (days === 0) {
            return { value: 0, text: 'Today'}
        } else if (days === 1) {
            return { value: 1, text: 'Tomorrow'}
        } else {
            return { value: days, text: `${days} Days Away`}
        }
    });

    eleventyConfig.addFilter("excerpt", function(str) {
        const content = new String(str);
        return content.split("\n<!--more-->\n")[0]
    });

    eleventyConfig.addFilter("restoreParagraphs", function(str) {
        const content = new String(str);
        return "<p>"+content.split(/\.\n/).join(".</p><p>")+"</p>"
    });

    eleventyConfig.addFilter("generatePostSVG", function(id) {
        return heroGen(""+id)
    })

    eleventyConfig.addFilter("toAbsoluteUrl", function(url) {
        return new URL(url, site.baseURL).href;
    })

    eleventyConfig.addFilter("handbookBreadcrumbs", (str) => {
        const parts = str.split("/");
        parts.shift();
        if (parts[parts.length-1] === "index") {
            parts.pop();
        }
        let path = "";
        return "/"+parts.map(p => {
            let url = `${path}/${p}`;
            path = url;
            return `<a class="mx-2" href="${url}">${p}</a>`
        }).join("/")
    });

    eleventyConfig.addFilter("rewriteHandbookLinks", (str, page) => {
        // If page.inputPath looks like: ./src/handbook/abc/def.md
        // then the url of the page will be `/handbook/abc/def/`
        // links of the form `./` or `[^/]` must be prepended with `../`
        // to ensure it links to the right place

        const isIndexPage = /(README.md|index.md)$/i.test(page.inputPath)

        const matcher = /((href|src)="([^"]*))"/g
        let match
        while ((match = matcher.exec(str)) !== null) {
            let url = match[3]
            if (/^(http|#|mailto:)/.test(url)) {
                // Do not rewrite absolute urls, in-page anchors or emails
                continue
            }
            // */abc.md#anchor => */abc/#anchor
            url = url.replace(/.md(#.*)?$/, '$1')
            // */README#anchor => */#anchor
            url = url.replace(/README(#.*)?$/, '$1')
            if (url[0] !== '/' && !isIndexPage) {
                url = '../'+url
            }
            // console.log(" rewrite link:", match[3],'=>',url)
            str = str.substring(0, match.index) + `${match[2]}="${url}"` + str.substring(match.index+match[1].length)
        }
        return str;
    })

    eleventyConfig.addFilter("handbookEditLink", (page, originalPath) => {
        if (!originalPath) {
            console.log(`WARNING: no "originalPath" property on ${page.filePathStem}`)
            return
        }
        let baseUrl
        let filePath = page.filePathStem
        if (/^\/docs/.test(page.url)) {
            baseUrl = 'https://github.com/flowforge/flowforge/edit/main/docs/'
        } else if (/^\/handbook/.test(page.url)) {
            baseUrl = 'https://github.com/flowforge/handbook/edit/main/'
            // Handbook files are at the root of their repo - so strip the prefix
            filePath = filePath.substring('/handbook'.length)
        }
        return baseUrl+originalPath.replace(/^.\//,'')
    })

    // Custom Shortcodes
    function resolvedImagePath(inputPath, relativeFilePath) {
        // Skip URLs
        try {
            new URL(string);
            return relativeFilePath
        } catch {}

        // Handle both relative to current file and relative root
        try {
            const resolvedRelativePath = path.resolve(path.dirname(inputPath), relativeFilePath)
            if (fs.existsSync(resolvedRelativePath)) {
                return resolvedRelativePath
            }
           
            const resolvedAbsolutePath = path.resolve(eleventyConfig.dir.input, relativeFilePath)
            if(fs.existsSync(resolvedAbsolutePath)) {
                return resolvedAbsolutePath
            }
        } catch {}

        return relativeFilePath
    }

    // Eleventy Image shortcode
    // https://www.11ty.dev/docs/plugins/image/
    eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths, sizes) {
        // Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
        // Warning: Avif can be resource-intensive so take care!
        let formats = ["avif", "webp", "auto"];
        let file = resolvedImagePath(this.page.inputPath, src);
        let metadata = await eleventyImage(file, {
            widths: widths ? widths.concat(widths.map((w) => w * 2)) : ["auto"],
            formats,
            outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
            filenameFormat: function (hash, src, width, format, options) {
                const { name } = path.parse(src);
                return `${name}-${hash}-${width}.${format}`;
            },
            svgShortCircuit: true,
        });
        
        sizes = sizes || widths ? widths.map((width) => `(min-device-pixel-ratio: 1.25) ${width * 2}px, (min-resolution: 120dpi) ${width * 2}px, ${width}px`).join(', ') : null

        let imageAttributes = {
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        };

        return eleventyImage.generateHTML(metadata, imageAttributes);
    });

    // Create a collection for sidebar navigation
    eleventyConfig.addCollection('nav', function(collection) {
        let nav = {}

        createNav('handbook')
        createNav('docs')

        function createNav (tag) {
            collection.getAll().filter((page) => {
                return page.data.tags?.includes(tag) && !page.url.includes('README')
                // url.indexOf('/handbook') === 0
            }).sort((a, b) => {
                // sort by depth, so we catch all the correct index.md routes
                const hierarchyA = a.url.split('/').filter(n => n)
                const hierarchyB = b.url.split('/').filter(n => n)
                return hierarchyA.length - hierarchyB.length
            }).forEach((page) => {
                // work out ToC Hierarchy
                // split the folder URI/URL, as this defines our TOC Hierarchy
                const hierarchy = page.url.split('/').filter(n => n)
                // recursively parse the folder hierarchy and created our collection object
                // pass nav = {} as the first accumulator - build up hierarchy map of TOC
                hierarchy.reduce((accumulator, currentValue, i) => {
                    // create a nested object detailing the full handbook hierarchy
                    if (!accumulator[currentValue]) {
                        accumulator[currentValue] = {
                            'name': currentValue,
                            'url': page.url,
                            'children': {}
                        }
                        if (page.data.navTitle) {
                            accumulator[currentValue].name = page.data.navTitle
                        }
                        // TODO: navGroup will be used in the rendering of the ToC at a later stage
                        if (page.data.navGroup) {
                            accumulator[currentValue].group = page.data.navGroup
                        }
                    }
                    return accumulator[currentValue].children
                }, nav)
            })
    
            // recursive functions to format our nav map to arrays
            function childrenToArray (children) {
                return Object.values(children)
            }
            function nestedChildrenToArray (value) {
                for (const [key, entry] of Object.entries(value)) {
                    if (entry.children && Object.keys(entry.children).length > 0) {
                        // ensure our grandchildren are all converted to arrays before
                        // we convert the higher level object to an array
                        nestedChildrenToArray(entry.children)
                        // now we have converted all grandchildren,
                        // we can convert our children to an array
                        entry.children = childrenToArray(entry.children)
                    } else {
                        delete entry.children
                    }
                }
                
            }
            // convert our objects to arrays so we can render in nunjucks
            nestedChildrenToArray(nav)
    
            // add functionality to group to-level items for better navigation.
            let groups = {
                'Other': {
                    name: 'Other',
                    order: -1,    // always render last
                    children: []
                }
            }

            // not req'd to have handbook in Website build, so this may be empty
            if (nav[tag]) {
                for (child of nav[tag].children) {
                    if (child.group) {
                        const group = child.group
                        if (!groups[group]) {
                            groups[group] = {
                                name: group,
                                order: 0,
                                children: []
                            }
                        }
                        groups[group].children.push(child)
                    } else {
                        // capture & flag top-level handbook docs, that haven't had a group assigned
                        groups['Other'].children.push(child)
                    }
                }
    
                function sortChildren (a, b) {
                    // sort children by 'order', then alphabetical
                    return b.order - a.order || a.name.localeCompare(b.name)
                }
    
                nav[tag].groups = Object.values(groups).sort(sortChildren)
                
                nav[tag].groups.forEach((group) => {
                    if (group.children) {
                        group.children.forEach((child) => {
                            if (child.children) {
                                child.children.sort(sortChildren)
                            }
                        })
                        group.children.sort(sortChildren)
                    }
                })
            }
        }

        return nav;
    });

    // Plugins
    eleventyConfig.addPlugin(pluginRSS)
    eleventyConfig.addPlugin(syntaxHighlight)
    eleventyConfig.addPlugin(codeClipboard)
    eleventyConfig.addPlugin(pluginMermaid)
        
    const markdownItOptions = {
        html: true,
    }

    const markdownItAnchorOptions = {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: `#&nbsp;`,
            placement: 'before'
        })
    }

    const markdownLib = markdownIt(markdownItOptions)
        .use(markdownItAnchor, markdownItAnchorOptions)
        .use(markdownItFootnote)
        .use(codeClipboard.markdownItCopyButton)

    markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        const imgSrc = token.attrGet('src')
        const imgAlt = token.content
        const imgTitle = token.attrGet('title')
    
        const htmlOpts = {
            title: imgTitle,
            alt: imgAlt,
            loading: 'lazy',
            decoding: 'async'
        }

        let formats = ['avif', 'webp', 'jpeg']
        let extraOpts = {}
        if (imgSrc.includes('.gif')) {
            formats = ['webp', 'gif']
            extraOpts = {
                sharpOptions: {
                    animated: true
                },
            }
        }
       
        // Handle both relative to post and root
        const widths = [650] // width of blog prose
        const imgOpts = {
            widths: widths.concat(widths.map((w) => w * 2)), // generate 2x sizes (retina)
            formats,
            outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
            filenameFormat: function (hash, src, width, format, options) {
                const { name } = path.parse(src);
                return `${name}-${hash}-${width}.${format}`;
            },
            svgShortCircuit: true,
            ...extraOpts
        }

        const imagePath = resolvedImagePath(env.page.inputPath, imgSrc)

        eleventyImage(imagePath, imgOpts)
        const metadata = eleventyImage.statsSync(imagePath, imgOpts)
    
        const generated = eleventyImage.generateHTML(metadata, {
            sizes: widths.map((width) => `(min-device-pixel-ratio: 1.25) ${width * 2}px, (min-resolution: 120dpi) ${width * 2}px, ${width}px`).join(', '),
            ...htmlOpts
        })
    
        return generated
    }

    eleventyConfig.setLibrary("md", markdownLib)

    return {
        dir: {
            input: "src"
        }
    }
};
