// hydrate-components.js @ https://freshman.dev/lib/2/hydrate-components/script.js https://freshman.dev/copyright.js
if (!window['hydrate-components.js']) (_=>{window['hydrate-components.js']=Date.now()
Object.entries({
    'common.js': '/lib/2/common/script.js',
}).map(([key,src])=>!window[key]&&document.head.append((x=>Object.assign(x,{innerHTML:(src=>(x=>{x.withCredentials=false;x.open('GET',src,false);x.send();return x.responseText})(new XMLHttpRequest()))(new URL(src,location.port==='3030'/*local testing on port 3030*/?location.origin:'https://freshman.dev').toString())}))(document.createElement('script'))))

const log = named_log('hydrate-components.js')
let _hydrated    
window.hydrated = new Promise(resolve => _hydrated = resolve)

defer(async () => {
    const INPUT_OPEN_MS = 100
    const INPUT_WIDTH = '15em'
    const title = document.title
    const subtitle = Q('meta[name=description')?.content

    // TODO re-render rendered components instead of wait for async
    const hydrate = (selector, hydration) => Promise.all((Array.isArray(selector) ? selector : QQ(`:is(${selector})[data-hydrate]`)).map(async (L, i, a) => {
        if (i === 0) log(a.length, Object.keys(hydrates).find(k => hydrates[k] === hydration) || selector)
        hydrate(L, hydrates.split)
        if (!await hydration(L, i, a)) {
            delete L.dataset['hydrate']
            L.dataset['hydrated'] = true
        }
    }))
    const hydrates = {
        split: L => {
            if (L.dataset['hydrate']) L.dataset['hydrate'].split(',').map(x => L.dataset[x] = '')
            return true
        },

        style: L => L.outerHTML = `<meta charset=utf-8><meta name="viewport" content="width=device-width,initial-scale=1" /><style>${css.common.base}:root{min-height:max-content;${css.mixin.solarize}--background:#fdfcfa;--color:#101010;--button:#eee;}*{box-sizing:border-box;font-family:SFMono-Regular,Menlo,Monaco,Consolas,"LiberationMono","CourierNew",monospace;}html,body{display:flex;flex-direction:column;align-items:flex-start}html{height:100%;background:var(--background);color:var(--color);font-size:12px;}body{flex-grow:1;padding:.5em;}iframe{border:0;display:block;}a{color:inherit;text-decoration:underline;}a:hover{background:var(--color);color:var(--background);}button,a,input,*[onclick]{font-size:1em;cursor:pointer;touch-action:manipulation;}button,input:is(:not([type]),[type=text],[type=password],[type=email]){border:1px solid currentColor;border-radius:10em;padding:.1667em.67em;height:calc(100%-1px);margin:.5px 0;}button{background:var(--button);user-select:none;}input:is(:not([type]),[type=text]){background:none;}input:is(:not([type]),[type=text],[type=password],[type=email])::placeholder{opacity:.425;}</style>`,
        // style: L => L.outerHTML = `<meta charset=utf-8><meta name="viewport" content="width=device-width,initial-scale=1" /><style>:root{--background:#fdfcfa;--color:#101010;--button:#eee;}*{box-sizing:border-box;font-family:SFMono-Regular,Menlo,Monaco,Consolas,"LiberationMono","CourierNew",monospace;}html,body{display:flex;flex-direction:column;}html{height:100%;background:var(--background);color:var(--color);font-size:12px;}body{flex-grow:1;padding:.5em;row-gap:.5em;}iframe{border:0;display:block;}a{color:inherit;text-decoration:underline;}a:hover{background:var(--color);color:var(--background);}button,a,input,*[onclick]{font-size:1em;cursor:pointer;touch-action:manipulation;}button,input:is(:not([type]),[type=text],[type=password],[type=email]){border:1px solid currentColor;border-radius:0;padding:.1667em.67em;}input:is(:not([type]),[type=text],[type=password],[type=email]):not(input:is(:not([type]),[type=text],[type=password],[type=email])+input:is(:not([type]),[type=text],[type=password],[type=email])){border-top-left-radius:.9em;border-top-right-radius:.9em}input:is(:not([type]),[type=text],[type=password],[type=email])+input:is(:not([type]),[type=text],[type=password],[type=email]){border-bottom-left-radius:.9em;border-bottom-right-radius:.9em;border-top:0;margin-top:-1px}button{background:var(--button);user-select:none;}input:is(:not([type]),[type=text]){background:none;}input:is(:not([type]),[type=text],[type=password],[type=email])::placeholder{opacity:.425;}</style>`,
        title: L => {
            L.innerHTML = `<span class=title style="font-weight: bold"></span>${title ? ' ' : ''}<span class=subtitle style="font-style:italic;opacity:.4;letter-spacing:-.1em"></span>`
            Q(L, '.title').textContent = title ? `(${title})` : ''
            Q(L, '.subtitle').textContent = subtitle
        },
        signup: L => {
            const display = L.dataset['signup'] || '🔔'
            log(display, display.toLowerCase().split('').some(x => strings.alphanum.includes(x)))
            const tag = display.toLowerCase().split('').some(x => strings.alphanum.includes(x)) ? 'a' : 'span'
            const toggle = node(`<${tag} data-hydrate data-label="${L.dataset['label'] || 'your email'}" data-toggle="${L.dataset['toggle'] || '✅︎'}" onclick>${display}</${tag}>`)
            const label = L.innerHTML
            L.innerHTML = label ? `<span class=label>${label}</span> ` : ''
            L.insertAdjacentElement('beforeend', toggle)
        },
        github: async L => {
            const repository = L.dataset['github']
            let tree
            tree = await fetch(`https://api.github.com/repos/${repository}/git/trees/HEAD?recursive=1`).then(r=>r.json()).then(x => {
                return x.message ? {
                    tree: [{
                        path: "README.md",
                    },]
                } : x
            }).catch(console.error)
            console.debug(tree)
            // const tree = JSON.parse(`{
            //     "sha": "0051499163d1b5a845eeb93031038f206486d4fc",
            //     "url": "https://api.github.com/repos/cfreshman/template-extension/git/trees/0051499163d1b5a845eeb93031038f206486d4fc",
            //     "tree": [
            //       {
            //         "path": ".gitignore",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "d347dcf68d4086d54351235ffbe3d25eea10f491",
            //         "size": 34,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/d347dcf68d4086d54351235ffbe3d25eea10f491"
            //       },
            //       {
            //         "path": "README.md",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "bc5e5a4caca5b7cb50879c7b466fd5cc67bdaed6",
            //         "size": 368,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/bc5e5a4caca5b7cb50879c7b466fd5cc67bdaed6"
            //       },
            //       {
            //         "path": "examples",
            //         "mode": "040000",
            //         "type": "tree",
            //         "sha": "396edc79e65deefc213de63836a81ad1666d6a81",
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/trees/396edc79e65deefc213de63836a81ad1666d6a81"
            //       },
            //       {
            //         "path": "examples/examples",
            //         "mode": "040000",
            //         "type": "tree",
            //         "sha": "396edc79e65deefc213de63836a81ad1666d6a81",
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/trees/396edc79e65deefc213de63836a81ad1666d6a81"
            //       },
            //       {
            //         "path": "examples/1-alert.js",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "b50310d69dc125d2133a959d798ed730fd1362fd",
            //         "size": 117,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/b50310d69dc125d2133a959d798ed730fd1362fd"
            //       },
            //       {
            //         "path": "examples/2-script-load.js",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "9a93b31b844b24b37b1197a2b1d91b7f1d5dc1c3",
            //         "size": 312,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/9a93b31b844b24b37b1197a2b1d91b7f1d5dc1c3"
            //       },
            //       {
            //         "path": "examples/3-storage.js",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "9c7dd2bce9c426e8de95d3e27089444d743c2b53",
            //         "size": 882,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/9c7dd2bce9c426e8de95d3e27089444d743c2b53"
            //       },
            //       {
            //         "path": "examples/4-watch.js",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "6774dc37ed30199f9c141d6fdb9a6e54dd06fcd1",
            //         "size": 1060,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/6774dc37ed30199f9c141d6fdb9a6e54dd06fcd1"
            //       },
            //       {
            //         "path": "index.js",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "6db4fa6bfc122267ae2cf9106b071dc36e8af07b",
            //         "size": 61,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/6db4fa6bfc122267ae2cf9106b071dc36e8af07b"
            //       },
            //       {
            //         "path": "manifest.json",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "1b682c1310845f558b03f83ea6f790fde6228e95",
            //         "size": 419,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/1b682c1310845f558b03f83ea6f790fde6228e95"
            //       },
            //       {
            //         "path": "package.json",
            //         "mode": "100644",
            //         "type": "blob",
            //         "sha": "a3d8ec5d5234fe3caab5750fb611deb8900d01f5",
            //         "size": 143,
            //         "url": "https://api.github.com/repos/cfreshman/template-extension/git/blobs/a3d8ec5d5234fe3caab5750fb611deb8900d01f5"
            //       }
            //     ],
            //     "truncated": false
            //   }`)
            const score = x => /README/.test(x.path) ? '---' : x.type === 'tree' ? '--'+x.path : /^\./.test(x.path) ? 'zzz' + x.path : x.path

            const readme = tree?.tree.find(x => x.path.startsWith('README'))
            const sorted = readme ? [readme] : tree?.tree.sort((a, b) => score(a).localeCompare(score(b)))
            L.dataset['stream'] = sorted.map(item => {
                // return 'github-tree://' + item.url + '?/' + item.path
                // if (item.type === 'tree') return item.url + '?/' + item.path
                return `https://raw.githubusercontent.com/${repository}/HEAD/${item.path}`

                // uh nvm
                // const data = await fetch(item.url).then(r => r.json())
                // const text = atob(data.content)
                // return URL.createObjectURL(new Blob(text, { type: {
                //     'js': 'text/javascript',
                //     'md': 
                // }[item.path.split('.').slice(-1).join('')] }))
            }).join(',') + ','
            L.dataset['reference'] = `https://github.com/${repository}`
            return true
        },
        stream: async L => {
            const items = L.dataset['stream'].split(',')
            let files
            if (items.length < 2) {
                // fetch as list
                files = await fetch(items[0]).then(r=>r.json())
            } else {
                files = items
            }

            // collapse folders, map to prefix
            let folders = {}
            files = files
            .filter(truthy)
            .map(x => (L.dataset['stream_prefix'] || '') + x)
            .filter(x => fnot(() => {
                const folder = x.split('/').slice(0, -1).join('/')
                const name = x.split('/').slice(-1)[0]
                const extension = name.split('.').slice(-2)/* TODO nested extension */[1]
                console.debug(folder, name, extension)
                if (!extension) folders[x] = []
                if (folders[folder]) {
                    folders[folder].push(x)
                    return true
                }
            }))
            // .debug(L.dataset['stream_prefix'], files, folders)
            console.debug(L.dataset['stream_prefix'], files, folders)

            const hr = new Date().getHours()
            const nighttime = false // TODO maybe re-enable for hydrated components // hr < 7 || 12 + 6 < hr
            const item = new URLSearchParams(location.search).get('')
            const scrollToItem = () => {
                const item = new URLSearchParams(location.search).get('')
                if (item) {
                    Q(document,  `#item-${item.split('.')[0]}`).scrollIntoView({ block: 'start' })
                }
            }

            const def_id = (await id(L.dataset['stream'])).slice(0, 8)
            const def = {
                id: def_id,
                node: node(`<div class=node id=node-${def_id}></div>`),
                style: `
                & {
                    overflow: auto;
                    margin-bottom: 1.5em;
                }
                &  .node > .item {
                    position: relative;
                    padding-top: 1em;
                    width: 100%;

                    padding: 0;
                    margin-bottom: 1.5em;
                }
                &  .node > .item > .content {
                    white-space: pre-wrap;
                    background: white;
                    color: black;
                    padding: .5em 1em;
                    padding-bottom: 2.5em;
                    font-size: .8em;

                    white-space: pre;
                    background: #fff; color: #000;
                    padding-bottom: 4em;
                    min-width: max-content;
                }
                &  .node > .item > .label {
                    /* font-size: .6em; */
                    font-size: .8em;
                    text-align: right;
            
                    position: absolute; bottom: 0; right: 0;
                    margin: .25em;
                    color: white;
                    /* mix-blend-mode: difference; */

                    bottom: unset;
                    mix-blend-mode: difference;
                    top: 100%;
                    display: inline-flex;
                    flex-direction: row-reverse;
                    justify-content: end;
                    overflow: auto;
                    opacity: .4;
                    max-width: calc(100% - 1.75em);
                }
                &  .node > .item > .label::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0;
                    height: 100%; width: 100%;
                    background: #000;
                }
                &  .node > .item .label a {
                    text-decoration: none;
                    mix-blend-mode: difference;
                    white-space: pre;
                }
                &  .node > .item > :first-child {
                    width: 100%;
                    border: 1px solid black;
                    display: flex;
                }
                &  .node > .item > .palette {
                    position: absolute;
                    top: 0; left: 100%; margin: 0 .5em;
                }
                `,
                render: async (at=undefined) => {
                    if (at) {
                        at.append(def.node)
                        at.dataset['node'] = def.id
                    }

                    const prefix = string.prefix(...files)
                    console.debug({prefix})

                    const unprotos = files // await Promise.all(files.map(unproto))

                    const file_ids = files.map(base62).map(x => x.slice(0, 8))
                    def.node.innerHTML = `
                    <style>
                        ${[
                            def.style,
                        ].filter(x=>x).join('\n').replaceAll('&', `[data-node=\"${def.id}\"]`)}
                    </style>` + files
                    .map((x, i) => {
                        const file = x
                        const folder = file.split('/').slice(0, -1).join('/')
                        const name = file.split('/').slice(-1)[0] + (folders[file] ? '/' : '')
                        const extension = '.'+name.split('.').slice(-2)/* TODO nested extension */[1]
                        const file_id = base62(file)

                        if (folders[file]) {
                            return `
    <div data-hydrate data-markdown>
    **${name.replace(prefix, '')}**
    ${folders[file].map(x => `  [${x.replace(file+'/', '')}](${x})`).join('\n')}
    </div>`
    //                         return `<div style="display:block;white-space:pre-wrap;padding:1em"><span><b>${file.replace(prefix, '')}/</b> (${folders[file].length})</span>${folders[file].map(x => `
    //   <a href=${x}>${x.replace(file+'/', '')}</a>`).join('')}
    // </div>`
                        }

                        console.debug(file, name, extension)
                        switch (extension) {
                        case '.png': case '.jpg':
                            return `<img src="${file}" />`
                        case '.html':
                            return `<iframe src="${file}" onload="
                            const L = event.target
                            L.height = L.contentWindow.document.documentElement.scrollHeight + 2
                            setInterval(() => {
                            L.height = L.contentWindow.document.documentElement.scrollHeight + 2
                            }, 100)
                            scrollToItem()
                            "></iframe>`
                        case '.md':
                            return `<div data-hydrate data-markdown data-code=${file}></div>`
                        case '.js': case '.json': case '.gitignore':
                            return `<div data-hydrate data-code=${file}></div>`
                        default:
                            fetch(file)
                            .then(res => res.text())
                            .then(text => {
                                console.debug(text)
                                Q(`#content-${file_id}`).innerHTML = text
                            })
                            return `<div class='content' id="content-${file_id}"></div>`
                        }
                    })
                    .map((x, i) => {
                        const file = files[i]
                        const folder = file.split('/').slice(0, -1).join('/')
                        const name = file.split('/').slice(-1)[0] + (folders[file] ? '/' : '')
                        const extension = '.'+name.split('.').slice(-2)/* TODO nested extension */[1]
                        const file_id = base62(file)

                        return `
                    <div class="item" id="item-${file_id}">
                        ${x}
                        ${
                        item === name ? `<div class="label" style="bottom:1.3em"><a target="_blank" href="${files[i]}">new tab ↗</a></div>` : ``
                        }
                        <div class="label"><a href="?=${file_id}">${name}</a></div>
                    </div>`
                    })
                    .join('\n') + (nighttime ? `
                    <style>
                        :root {
                        --background: #322c2c;
                        --color: #f1f1f1;
                        }
                    </style>
                    ` : '')

                    await hydrate(QQ(def.node, '[data-hydrate][data-markdown]'), hydrates.markdown)
                    await hydrate(QQ(def.node, '[data-hydrate][data-code]'), hydrates.code)

                    scrollToItem()
                    QQ(L,  'iframe').map(frame => on(frame, 'load', () => {
                        try {
                            const links = QQ(frame.contentWindow.window.document,  'a[href]')
                            console.debug(frame.src, links.map(x => x.href))
                            links.map(link => on(link, 'click', e => {
                            if (!link.href.startsWith(location.origin)) {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(link.href, '_blank')
                            }
                            }))
                        } catch {}
                    }))
                },
            }
            await def.render(L)
            return L.dataset['reference'] && hydrate(L, hydrates.reference)
        },
        markdown: async L => {
            if (L.dataset['markdown'] !== undefined || L.dataset['code'].endsWith('.md')) {
        
                try {
                    if (!(L.textContent || L.dataset['markdown'])) L.textContent = await fetch(L.dataset['code']).then(r=>r.text())
                } catch (e) {
                    console.debug(e)
                    L.textContent = L.textContent || `error displaying ${L.dataset['code']}`
                }
                console.debug(L.textContent)
        
                L.style.cssText += `
                background: #f8f8f8; color: #000; border: 1px solid currentColor;
                background: #ffe;
                background: #fbfaff;
                display: block;
                border-radius: .25em;
                padding: .75em;
                margin: 0 .5em !important;
                position: relative;
                white-space: pre-wrap;
                word-break: normal;
                border-radius: calc(0.8em + .5em - .2em);
                font-size: 1em !important;
                width: auto; min-width: -webkit-fill-available;
                `

                L.innerHTML = (L.textContent || L.dataset['markdown']).trim()
                .replace(/^\> ((.+\n\> )+)/gim, `<div style="display:flex;flex-direction:row;width:100%"><span>&gt;</span><span style="flex-grow:1;padding-left:1em">$1</span></div>`)
                // .replace(/^\> ([^\<]|$)/gim, `$1`)
                .replace(/^\> /gim, ``)
                .replace(/```(((?!```)(.|\n))+)```/gim, `<div data-hydrate data-code data-code_more style="margin: .25em 0">$1</div>`)
                .replace(/`(((?!`)(.|\n))+)`/gim, `<span data-hydrate data-code>$1</span>`)
                .replace(/\*\*(((?!\*\*)(.|\n))+)\*\*/gim, `<b>$1</b>`)
                .replace(/__(((?!__)(.|\n))+)__/gim, `<span style="text-decoration:underline">$1</span>`)
                .replace(/(#)+ (.+)/gim, `<hN data-h=$1>$2</hN>`)
                .replace(/!\[([^\]]*)\]\(([^\s)]+)\)/gim, `<img alt="$1" src="$2" />`)
                .replace(/\[([^\]]*)\]\(([^\s)]+)\)/gim, `<a href=$2>$1</a>`)
                .replace(/(^\n)+/gim, '\n')
                .replace(/^\- (.*)/gim, `<span>• $1</span>`)
        
                QQ(L, '[data-h]').map(L => {
                    const n = L.dataset['h'].length + 2
                    const id = encodeURIComponent(L.textContent.slice(0, 20))
                    L = (x => {
                        x.append(node(`<a style="opacity:.5;text-decoration:none;margin-left:.33em;padding:0 .167em" href="#${id}">§</a>`))
                        L.insertAdjacentElement('afterend', x)
                        // L.insertAdjacentElement('afterend', (y => {
                        //     // y.prepend(x)
                        //     // return y
                        // })(node(`<div style="display:flex"><a href="#${id}">#</a></div>`)))
                        L.remove()
                        return x
                    })(node(L.outerHTML.replace(/(\<\/?)hN/i, `$1h${n} id="${id}"`)))
                    L.style.cssText += `;
                    margin: 0;
                    ${n < 2 ? `display: block; border-bottom: 1.5px solid #0001;` : ''}
                    `
                })
                
                return L.dataset['reference'] && hydrate(L, hydrates.reference)
            } else {
                return true
            }
        },
        frame: L => {
            if (L.dataset['frame'] === true) L.dataset['frame'] = L.href || L.textContent
            if (!L.href) L.href = L.dataset['frame']
            // if (!L.textContent) L.textContent
            // L.dataset['reference'] = L.href
            // hydrate(L, hydrates.reference) = L.href.replace(/https?:\/\//, '')
            L.insertAdjacentHTML('afterend', `
            <iframe src=${L.href} style="
            width: 400px; aspect-ratio: 4/5;
            border: 2px solid #0002; border-radius: 4px;
            max-width: calc(100vw - 2em);
            box-sizing: border-box;
            "></iframe>`)
            L.dataset['reference'] = JSON.parse(L.dataset['reference']??'true') ? L.href : ''
            return hydrate(L, hydrates.reference)
        },
        reference: L => {
            console.debug('REFERENCE', L.dataset['reference'])
            L.insertAdjacentHTML('beforebegin', `<div><a href="${L.dataset['reference']}">${L.dataset['reference'].replace(/https?:\/\//, '')}</div>`)
        },

        external: L => {
            if (!L.textContent) L.textContent = L.dataset['external']
            // if (!L.href || L.href === location.origin + location.pathname) L.href = L.textContent.replace(/^(https?:\/\/)?/, 'http://')
            if (!L.href) L.href = L.textContent.replace(/^(https?:\/\/)?/, 'http://')
            L.href = L.href.replace(/\.$/, location.host)
            if (!(L.href.startsWith('/') || L.href.startsWith(location.origin)) || L.dataset['external']) /\w$/.test(L.textContent) && L.append((/mailto:/.test(L.href) ? '✉' : '') + '↗')
        },
        player: L => {
            const href = L.dataset['player'] || L.href
            const label = L.textContent
            
            let added = false
            on(L, 'click', e => {
                L.href = e.metaKey ? href : ''
                if (!e.metaKey) {
                    e.preventDefault()
                    if (added) {
                        added.remove()
                        added = false
                    }
                    else {
                        added = node(`
                        <iframe src=${href} style="
                        width: 400px; aspect-ratio: 4/5;
                        border: 2px solid #0002; border-radius: 4px;
                        max-width: calc(100vw - 2em);
                        box-sizing: border-box;
                        "></iframe>`)
                        L.insertAdjacentElement('afterend', added)
                    }
                    L.textContent = added ? 'x '+label : '> '+label
                }
            })
            L.textContent = '> '+label
        },
        code: async L => {
            L.style.cssText += `
            background: #000e; color: #fff;
            font-family: monospace;
            white-space: pre;
            `
        
            if (L.src) L.dataset['code'] = L.src
            try {
                if (!L.textContent) {
                    L.textContent = await fetch(L.dataset['code']).then(r=>r.text())
                    console.debug('code fetched for display', L.textContent)
                }
            } catch (e) {
                console.debug(e)
                L.textContent = L.textContent || 'error'
            }
            L.textContent = L.textContent.trimStart()

            if(0)0
            else if (L.textContent.includes('\n')) {
                L.style.cssText += `
                display: block;
                border-radius: .8em;
                line-height: 1.15;
                padding: calc(1.3em + 2px * 3) 0 .55em;
                position: relative;
                overflow: auto;
                margin: .25em 0 .5em;
                width: -webkit-fill-available;
                `
        
                const code = L.textContent.trim() + '\n'
                const lines = code.split('\n')
                const full = L.dataset['code_more'] !== undefined
                const def_id = (await id(!L.dataset['code'] ? L.dataset['label'] || L.textContent : L.dataset['code'])).slice(0, 8)
                const def = {
                    id: def_id,
                    ACTION_DISPLAY_MS: 3_000,
                    copied: false, saved: false, previewed: false, hidden: full ? false : true,
                    line: undefined,
                    update: state => {
                        Object.assign(def, state)
                        def.render()
                    },
                    copy: e => {
                        setTimeout(() => def.update({ copied: false }), def.ACTION_DISPLAY_MS)
                        def.update({ copied: true })
                        copy(code)
                    },
                    save: e => {
                        setTimeout(() => def.update({ saved: false }), def.ACTION_DISPLAY_MS)
                        def.update({ saved: true })
                        download(code, L.dataset['code']?.split('/').slice(-1)[0] || `${def_id}.txt`)
                    },
                    preview: e => {
                        setTimeout(() => def.update({ previewed: false }), def.ACTION_DISPLAY_MS)
                        def.update({ previewed: true })
                        
                        const render = node(`<iframe
                        style="
                        border: 0;
                        height: 100%;
                        width: 100%;
                        "
                        src=data:text/html;charset=utf-8,${encodeURIComponent(lines.join('\m'))}></iframe>`)
                        L.append(render)
                    },
                    toggle: e => {
                        def.update({ hidden: !def.hidden })
                    },
        
                    node: node(`<div class=node id=node-${def_id}></div>`),
                    style: `
                    & a {
                        text-decoration: none;
                    }
                    & .node {
                        position: absolute; top: 0; right: 0;
                        display: flex; flex-direction: row; gap: 2px;
                        padding: 2px;
                        box-sizing: border-box; width: 100%;
                    }
                    & .node [data-action] {
                        color: #fff; border: 1px solid #fff;
                        padding: 0 .25em; border-radius: 10em;
                        cursor: pointer;
                        text-decoration: none;
                        opacity: .5;
                        z-index: 1;
                        overflow: hidden;
                        flex-shrink: 0;

                        display: inline-flex; align-items: center;
                    }
                    & .node [data-action]:is(.file, .anchor) {
                        color: #000; background: #fff; border-color: transparent; opacity: 1;
                        min-width: .67em;
                    }
                    & .node [data-action]:hover {
                        color: #000; background: #fff;
                        opacity: 1;
                    }
                    & .node [data-action].file:hover {
                        position: absolute; left: 0; margin: 0 2px; width: -webkit-fill-available;
                        display: flex; flex-direction: row-reverse;
                        max-width: fit-content;
                    }
                    & .node:has(.file[data-action]:hover) [data-action]:not(.file) {
                        pointer-events: none;
                    }

                    .hydrate-code-line a {
                        background: inherit !important;
                        color: inherit !important
                    }
                    .hydrate-code-line .hydrate-code-selected {
                        background: #fff3 !important;
                    }
                    `,
                    render: (at=undefined) => {
                        if (at) {
                            at.append(def.node)
                            at.dataset['node'] = def.id
                        }
                        def.node.innerHTML = `
                        <style>
                        ${[
                            def.style,
                            def.hidden && `
                            & {
                                max-height: 10em;
                            }
                            `,
                        ].filter(x=>x).join('\n').replaceAll('&', `[data-node=\"${def.id}\"]`)}
                        </style>
                        <a data-action class=${L.dataset['code'] ? 'file' : 'anchor'} style="flex-shrink: 1" href=${L.dataset['code'] || `#${def.id}`}><div style="flex-grow:1"></div>${(x => {
                            try {
                                const url = new URL(x)
                                return `<span>${url.pathname.split('/').slice(-1)[0]} <span style="opacity:.4">(${url.host})</span></span>`
                            } catch {
                                return x
                            }
                        })(L.dataset['code']
                        || L.dataset['label']
                        // || `<span># <span style="opacity:.33">share</span></span>`
                        || '#'
                        )}</a>
                        <div style="flex-grow:1"></div>
                        ${
                        def.copied ? `<a data-action=copy style="pointer-events:none">copied!</a>` : 
                        def.saved ? `<a data-action=save style="pointer-events:none">saved!</a>` :
                        def.previewed ? `<a data-action=preview style="pointer-events:none">rendered!</a>` :
                        `
                        ${full ? '' : `<a data-action=toggle/onclick>${def.hidden ? 'more' : 'less'}</a>`}
                        <a data-action=save/onclick>save</a>
                        <a data-action=copy/onclick>copy</a>
                        `}
                        `

                        // <a data-action class=file style="flex-shrink: 1" href=${L.dataset['code'] || `#${def.id}`}><div style="flex-grow:1"></div>${(x => {
                        //     try {
                        //         const url = new URL(x)
                        //         return `${url.host} ${url.pathname.split('/').slice(-1)[0]}`
                        //     } catch {
                        //         return x
                        //     }
                        // })(L.dataset['code']
                        // // || `<span># <span style="opacity:.33">share</span></span>`
                        // || '#'
                        // )}</a>
                        
                        QQ(def.node, '[data-action]').map(L => {
                            const [action=undefined, events=''] = L.dataset['action']?.split('/')
                            events.split(',').map(event => L[event] = e => def[action](e))
                        })
                        if (def.hidden) {
                            const scrollSave = L.scrollTop
                            L.scrollTop = 1e6
                            if (L.scrollTop === scrollSave) QQ(def.node, '[data-action]').find(x => x.textContent === 'more')?.remove()
                            L.scrollTop = scrollSave
                        }
                    },
                }

                if (/script/i.test(L.tagName)) {
                    const script = L
                    L = node(script.outerHTML.replace(/(\<\/?)script/g, '$1div'))
                    script.insertAdjacentElement('afterend', L)
                    script.remove()
                }

                L.innerHTML = lines.map((x,i) => `<div class=hydrate-code-line><span style="cursor:unset;display:inline-block;width:100%;"></span></div>`).join('')
                QQ(L, 'span').map((line, i, a) => {
                    const x = lines[i]
                    
                    line.innerHTML = `<a style="user-select:none" href=#${def_id}${i}>${(a.length > 1 ? i : '').toString().padStart(Math.max(2, Math.log10(a.length) + 1))}</span>| `
                    line.insertAdjacentText('beforeend', x)
                    line.onclick = e => {
                        Q('.hydrate-code-selected')?.classList.remove('hydrate-code-selected')
                        line.classList.add('hydrate-code-selected')
                    }
                })
                
                const selected = Q(L, `[href="${location.hash}"]`)
                if (selected) {
                    def.update({ hidden: false })
                    selected.scrollIntoView({ block: 'center' })
                    selected.click()
                }

                // L.textContent = lines.map((x,i,a) => `${(a.length > 1 ? i : '').toString().padStart(Math.max(2, Math.log10(a.length) + 1))}| ${x}`).join('\n')
                def.render(L)
            } else {
                L.style.cssText += `
                min-width: max-content;
                margin: -.15em;
                padding: .15em;
                border-radius: .15em;
                background: #000e;
                cursor: pointer;
                
                position: relative;
                display: inline-flex; align-items: center;
                user-select: all;
                `

                let down
                on(L, 'pointerdown', e => down = Date.now())
                on(L, 'pointerup', e => {
                    if (Date.now() - down < 150) {
                        copy(L.textContent)
                        displayStatus(L, 'copied', 1_000)
                    }
                })
            }

            return L.dataset['reference'] && hydrate(L, hydrates.reference)
        },
        toggle: L => {
            const state = {}
            state.event = L.onclick = _=>{
                Object.assign(state, {
                    display: L.innerHTML,
                    value: L.dataset['value'] || '',
                    placeholder: L.dataset['label'] || '',
                })
                
                const input = node(`<input style="
                margin: -.15em;
                box-sizing: border-box;
                height: 1.5em; width: 1.5em;
                transition: width ${INPUT_OPEN_MS}ms linear, opacity ${INPUT_OPEN_MS / 2}ms;
                width: 0;
                border: 1px solid currentColor; border-radius: 2em; outline: 0;
                margin-left: .67em;
                color: currentColor;
                "></input>`)
                input.value = state.value
                input.placeholder = state.placeholder
                L.insertAdjacentElement('afterend', input)
        
                const update = (value) => {
                    if (value !== state.value) {
                        if (!L.dataset['uuid']) L.dataset['uuid'] = [Date.now(), rand.hex(8)].join('-')
                        if (value) fetch(location.origin.replace(/:\d+/, ':5050') + `/api/q/+/updates?${new URLSearchParams({
                            msg: JSON.stringify({
                                value,
                                uuid: L.dataset['uuid'],
                                href: location.href,
                            })
                        })}`)
                        else fetch(location.origin.replace(/:\d+/, ':5050') + `/api/q/+/updates?${new URLSearchParams({
                            msg: JSON.stringify({
                                remove: state.value,
                                uuid: L.dataset['uuid'],
                                href: location.href,
                            })
                        })}`)
                        if (!value !== !state.value) {
                            L.innerHTML = L.dataset['toggle']
                            L.dataset['toggle'] = state.display
                            state.display = L.innerHTML
                        }
                        state.value = input.value = L.dataset['value'] = value || ''
                    }
                }
                const close = () => {
                    input.style.transition = input.style.opacity = 0
                    input.style.width = 0
                    setTimeout(_=> {
                        L.onclick = state.event
                        setTimeout(_=> input.remove(), INPUT_OPEN_MS)
                    }, INPUT_OPEN_MS * 2)
                }
                const revert = _=> {
                    setTimeout(_=> {
                        update(state.value)
                        close()
                    }, state.value || input.value !== state.value ? INPUT_OPEN_MS * 2 : 0)
                    input.value = state.value
                }
                L.onclick = input.onblur = _=> revert()
                
                input.onkeydown = e => {
                    if(0)0
                    else if (e.key === 'Enter') {
                        update(input.value)
                        if (!input.value) close()
                        else input.blur()
                    }
                    else if (e.key === 'Escape') revert()
                }
                input.onclick = e => e.stopPropagation()
        
                L.style.userSelect = 'none'
                input.focus()
                input.style.width = INPUT_WIDTH
                input.style.opacity = 1
            }
        },
        checkbox: L => {
            const label_l = /label/i.test(L.parentNode.tagName) ? L.parentNode : L
            const hydrate_checkbox_i = L.dataset['hydrate_checkbox_i'] = hydrates._checkbox.i
            const label_content = label_l.textContent.trim()
            const key = `hydrate-checkbox-${L.dataset['hydrate_checkbox'] = encodeURIComponent(label_content ? label_content+list(L.parentNode.children).indexOf(L) : hydrate_checkbox_i)}`
            L.checked = strings.json.parse(localStorage.getItem(key) || 'false')
            // on(L, 'change', e => localStorage.setItem(key, L.checked))
            // on(L, 'change', e => {
            //     log(e.shiftKey)
            //     if (e.shiftKey && hydrates._checkbox.last) {
            //         const from = hydrates._checkbox.last
            //         const from_i = strings.json.parse(from.dataset['hydrate_checkbox_i'])
            //         // const checkboxes = QQ(':is([data-hydrate], [data-hydrated])[type=checkbox], [data-checklist] [type=checkbox]')
            //         // range(...[from_i, hydrate_checkbox_i].sort((a,b)=>a-b).map((x,i)=>i===1?x+1:x)).map(i => checkboxes[i])
            //         range(...[from_i, hydrate_checkbox_i].sort((a,b)=>a-b).map((x,i)=>i===1?x+1:x)).map(i => {
            //             const included = Q('[hydrate_checkbox_i')
            //             console.debug(included)
            //             included.checked = from.checked
            //         })
            //     } else {
            //         localStorage.setItem(key, L.checked)
            //     }
            //     hydrates._checkbox.last = L
            // })
            L.hydrated_onchange = e => {
                localStorage.setItem(key, L.checked)
            }
            on(L, 'pointerdown', e => hydrates._checkbox.down = (L.checked = !L.checked))
            on(L, 'pointerup pointercancel', e => hydrates._checkbox.down = undefined)
            on(L, 'pointermove', e => {
                if (hydrates._checkbox.down !== undefined) {
                    L.checked = hydrates._checkbox.down
                    L.hydrated_onchange(e)
                }
            })
            on(L, 'click', e => (e.preventDefault()||1)&&defer(() => {
                if (e.shiftKey && hydrates._checkbox.last) {
                    const from = hydrates._checkbox.last
                    const from_i = strings.json.parse(from.dataset['hydrate_checkbox_i'])
                    // const checkboxes = QQ(':is([data-hydrate], [data-hydrated])[type=checkbox], [data-checklist] [type=checkbox]')
                    // range(...[from_i, hydrate_checkbox_i].sort((a,b)=>a-b).map((x,i)=>i===1?x+1:x)).map(i => checkboxes[i])
                    range(...[from_i, hydrate_checkbox_i].sort((a,b)=>a-b).map((x,i)=>i===1?x+1:x)).map(i => {
                        const included = Q(`[data-hydrate_checkbox_i="${i}"]`)
                        if (included.checked !== from.checked) {
                            included.checked = from.checked
                            included.hydrated_onchange(e)
                            // included.focus()
                            // included.click()
                        }
                    })
                } else {
                    L.hydrated_onchange(e)
                    // localStorage.setItem(key, L.checked)
                }
                hydrates._checkbox.last = L
            }))
            log(L, key, localStorage.getItem(key), L.checked)
        }, _checkbox: {
            get i(){return this._i = (this._i||0) + 1},
            last: undefined,
            down: undefined,
        },
        audio: L => {
            L.style.display = 'none'
            const timeDisplay = (sec) => {
                return [Math.floor(sec / 60), Math.ceil(sec % 60)].map(x => String(x).padStart(2, '0')).join(':')
            }
            const visual = node(`<div class="audio_visual">
                <style>
                    .audio_visual {
                        font-size: 1.25em;
                        background: #000;
                        color: #fff;
                        padding: .25em .75em;
                        border-radius: 10em;
                    }
                    .audio_visual:not(.playing) .audio_visual_pause {
                        text-decoration: none;
                    }
                    .audio_visual.playing .audio_visual_play {
                        text-decoration: none;
                    }
                    .audio_visual:not(.started) .audio_visual_reset {
                        display: none
                    }
                </style>
                <a class="audio_visual_play">play</a>
                <a class="audio_visual_pause">pause</a>
                <span class="audio_visual_time"></span>
                <a class="audio_visual_reset">reset</a>
            </div>`)

            Q(visual, '.audio_visual_play').onclick = e => {
                L.play()
                visual.classList.toggle('playing', true)
                visual.classList.toggle('started', true)
            }
            Q(visual, '.audio_visual_pause').onclick = e => {
                L.pause()
                visual.classList.toggle('playing', false)
            }
            on(L, 'play timeupdate', e => {
                Q(visual, '.audio_visual_time').innerHTML = L.currentTime || !L.paused ? `${timeDisplay(L.currentTime)} / ${timeDisplay(L.duration)}` : timeDisplay(L.duration)
            })

            const reset = () => {
                L.pause()
                L.currentTime = 0
                defer(() => {
                    visual.classList.toggle('playing', false)
                    visual.classList.toggle('started', false)
                })
            }
            Q(visual, '.audio_visual_reset').onclick = e => reset()
            on(L, 'loadedmetadata ended', e => reset())

            L.insertAdjacentElement('afterend', visual)
        },
        combobox: L => {
            L.style.display = 'none'
            const placeholder = L.dataset['placeholder'] || 'type to select'
            const selected = Q(L, '[selected]')
            const visual = node(`<div class="combobox_visual">
                <style>
                .combobox_visual {
                    position: relative;
                    ${devices.is_mobile ? `
                    font-size: max(1em, 16px);
                    `: ''}
                }
                .combobox_visual_input {
                    background: #fff; color: #000;
                    border: 1px solid #000;
                    padding: 1px 3px !important;
                    border-radius: 2px !important;
                    margin: 0;
                }
                .combobox_visual_options {
                    display: none;
                    position: absolute;
                    top: 100%; left: 0;
                    margin: 0 2px;
                    border: 1px solid #000;
                    min-width: calc(100% - 4px);
                    border-radius: 2px !important;
                    z-index: 1;
                }
                .combobox_visual_options .combobox_visual_option {
                    padding: 1px 3px;
                    background: #fff; color: #000;
                    cursor: pointer;
                }
                .combobox_visual_options .combobox_visual_option:is(:hover, :focus),
                .combobox_visual_options:not(:has(.combobox_visual_option:is(:hover, :focus))) .combobox_visual_option:first-child {
                    filter: invert();
                }
                .combobox_visual:focus-within .combobox_visual_options {
                    display: block;
                }
                </style>
                <input class="combobox_visual_input" tabindex=0 placeholder="${placeholder}" value="${selected?.value||''}"></input>
                <div class="combobox_visual_options"></div>
            </div>`)
            const input = Q(visual, 'input')
            const options = Q(visual, '.combobox_visual_options')
            const updateOptionsList = (select_first=false) => {
                options.innerHTML = ''
                const search = input.value
                const scoreOption = option => option.value === search ? 0 : 1
                const matched_options = list(L.children).filter(option => {
                    const value = option.value || ''
                    const text = option.textContent || ''
                    return !search || value.includes(search) || text.includes(search)
                }).map(option => {
                    const option_value = option.value || option.textContent
                    return {
                        value: option_value,
                        option,
                    }
                }).sort((a, b) => scoreOption(a) - scoreOption(b))
                // log({matched_options})
                matched_options.map(({ value: option_value, option }, i) => {
                    const option_node = node(`<div class="combobox_visual_option" tabindex=0>
                        ${option.innerHTML || option_value}
                    </div>`)
                    option_node.onclick = option_node.onkeydown = e => {
                        if (e.key && e.key !== 'Enter') return
                        e.preventDefault()
                        e.stopPropagation()
                        // log(option)
                        option.click()
                        L.value = input.value = (input.value === option_value) ? '' : option_value
                        // log(L.value)
                        updateOptionsList()
                        if (!L.value) input.focus()
                    }
                    options.append(option_node)
                    if (select_first && i === 0) {
                        // defer(() => option_node.click())
                        defer(() => {
                            option_node.click()
                        })
                    }
                }).join('\n')
                // if (!input.value && document.activeElement === input) {
                //     options.style.display = 'block'
                // }
            }
            on(input, 'input', e => {
                updateOptionsList()
            })
            on([input, options], 'focus', e => {
                options.style.display = 'block'
            })
            on(input, 'blur', e => {
                defer(() => {
                    options.style.display = ''
                }, 150)
            })
            on(input, 'keydown', e => {
                if (e.key === 'Enter') {
                    updateOptionsList(true)
                    input.blur()
                }
                if (e.key === 'Escape') {
                    input.blur()
                    input.value = L.value
                }
            })
            updateOptionsList()
            L.insertAdjacentElement('afterend', visual)
        },
        switch: L => {
            const id = `hydrate-switch-${rand.alphanum(16)}`
            L.classList.add(id)
            const css = node(`<style>
            .${id} {
                -webkit-appearance: none;
                width: 3em;
                height: 1.5em;
                flex-shrink: 0;
                background: transparent;
                color: #000;
                border: 1px solid currentcolor;
                border-radius: 10em;
                position: relative;
            }
            .${id}::after {
                content: "";
                position: absolute;
                top: 0; left: 0; 
                height: 1em; width: 1em;
                margin: calc(.25em - 1px);
                border-radius: 10em;
                background: currentcolor;
            }
            .${id}:checked {
                background: #000;
                color: #fff;
            }
            .${id}:checked::after {
                left: unset; right: 0;
            }
            </style>`)
            L.insertAdjacentElement('afterend', css)
        },
    }

    await hydrate('*', hydrates.split)
    await hydrate('[data-style]', hydrates.style)
    await hydrate('[data-title]', hydrates.title)

    await hydrate('[data-signup]', hydrates.signup)
    await hydrate('[data-github]', hydrates.github)
    await hydrate('[data-stream]', hydrates.stream)

    await hydrate('[data-code], code', hydrates.markdown)
    await hydrate('[data-frame]', hydrates.frame)
    await hydrate('[data-reference]', hydrates.reference)
    await hydrate('[data-external]', hydrates.external)
    await hydrate(QQ('html:not(.preserve-links) [href]:not([data-player]):not([data-ignore])'), hydrates.external)
    await hydrate('[data-player]', hydrates.player)
    await hydrate('[data-code], code', hydrates.code)
    await hydrate(QQ('[data-hydrate][type=checkbox]:not([data-switch]), [data-checklist] [type=checkbox]'), hydrates.checkbox)
    await hydrate(QQ('audio[controls]'), hydrates.audio)
    await hydrate(QQ('[data-combobox]'), hydrates.combobox)
    await hydrate(QQ('[data-switch]'), hydrates.switch)

    document.head.append(node(`<style>
    input::placeholder {
        color: inherit;
    }
    </style>`))
    await hydrate('[data-toggle]', hydrates.toggle)

    Object.assign(window, {hydrate,hydrates})
    _hydrated()

})})()
