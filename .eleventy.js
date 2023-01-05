const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")
const markdownItFootnote = require("markdown-it-footnote")
const codeClipboard = require("eleventy-plugin-code-clipboard");
const spacetime = require("spacetime");
const heroGen = require("./lib/post-hero-gen.js");
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");
const { stringify } = require("postcss");
const util = require('util')
const fg = require('fast-glob');

module.exports = function(eleventyConfig) {
    eleventyConfig.setWatchThrottleWaitTime(200); // in milliseconds
    eleventyConfig.setUseGitIgnore(false);

    // Put robots.txt in root
    eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });

    // TODO: when we move to 11ty v1.0, use the following
    // rather than ignoring git ignore
    //eleventyConfig.ignores.delete("src/handbook");

    eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
    eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
    eleventyConfig.addLayoutAlias('nohero', 'layouts/nohero.njk');
    eleventyConfig.addLayoutAlias('redirect', 'layouts/redirect.njk');
    eleventyConfig.addPassthroughCopy("src/images");
    // eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/CNAME");
    eleventyConfig.addPassthroughCopy({"src/favicon/*":"/"});
    eleventyConfig.addPassthroughCopy("src/.well-known")
    eleventyConfig.addPassthroughCopy("src/**/images/**/*");
    eleventyConfig.addPassthroughCopy("src/**/videos/**/*");


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

    // Create a collection for sidebar navigation
    eleventyConfig.addCollection('nav', function(collection) {

        let nav = {}
        
        collection.getAll().filter((page) => {
            return page.data.tags?.includes('handbook')
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
                // create a nested object detailing hte full handbook hierarchy
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
        // TODO: Not currently shown in UI, but here for future use as will improve nav
        let groups = {}
        if (nav.handbook) {
            for (child of nav.handbook.children) {
                if (child.group) {
                    const group = child.group
                    if (!groups[group]) {
                        groups[group] = []
                    }
                    groups[group].push(child)
                }
            }

            // sort top-level nav to ensure consistent nav ordering
            nav.handbook.children.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
        }

        return nav;
    });

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
    eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"))
    eleventyConfig.addPlugin(pluginMermaid);

    const markdownItOptions = {
        html: true,
    }

    // Options for the `markdown-it-anchor` library
    const markdownItAnchorOptions = {
        permalink: markdownItAnchor.permalink.linkInsideHeader({
            symbol: `#&nbsp;`,
            placement: 'before'
        })
    }

    const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
    eleventyConfig.addPlugin(syntaxHighlight)
	eleventyConfig.addPlugin(codeClipboard)

    const markdownLib = markdownIt(markdownItOptions)
        .use(markdownItAnchor, markdownItAnchorOptions)
        .use(markdownItFootnote)
		.use(codeClipboard.markdownItCopyButton)

    eleventyConfig.setLibrary("md", markdownLib)

    return {
        dir: {
            input: "src"
        }
    }
};
