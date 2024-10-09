"use strict";
const
    topBarNavigation = ".notion-topbar .notion-focusable .notranslate:not([role='button'])",
    pageTitle = "[placeholder='Untitled']",
    pageBackground = ".whenContentEditable > .pseudoSelection:first-of-type",
    pageIconAndControlsContainer = ".pseudoSelection:not(.whenContentEditable > *)",
    contentContainer = ".notion-page-content",
    textBlock = ".notion-text-block",
    todoBlock = ".notion-to_do-block",
    bulletedListBlock = ".notion-bulleted_list-block",
    numberedListBlock = ".notion-numbered_list-block",
    headerBlocks = ".notion-header-block, .notion-sub_header-block, .notion-sub_sub_header-block",
    toggleListBlock = ".notion-toggle-block",
    quoteBlock = ".notion-quote-block",
    calloutBlock = ".notion-callout-block",
    tableOfContentsBlock = ".notion-table_of_contents-block",
    imageBlock = ".notion-image-block",
    videoBlock = ".notion-video-block",
    audioBlock = ".notion-audio-block",
    fileBlock = ".notion-file-block",
    embedBlock = ".notion-embed-block",
    bookmarkBlock = ".notion-bookmark-block",
    captionBlockSelector = "[placeholder^='Write a caption']",
    columnsListBlock = ".notion-column_list-block",
    columnBlock = ".notion-column-block",
    autoDirElementsSelectors = `.notion-topbar .notion-focusable .notranslate:not([role='button']), [placeholder='Untitled'], ${textBlock}, ${todoBlock}, ${bulletedListBlock}, ${numberedListBlock}, .notion-header-block, .notion-sub_header-block, .notion-sub_sub_header-block, .notion-toggle-block, .notion-quote-block, .notion-callout-block, ${tableOfContentsBlock}, ${imageBlock} ${captionBlockSelector}, ${videoBlock} ${captionBlockSelector}, ${audioBlock} ${captionBlockSelector}, ${fileBlock} ${captionBlockSelector}, ${embedBlock} ${captionBlockSelector}, ${bookmarkBlock} ${captionBlockSelector}`;
let {pathname: a} = window.location;

function active() {
    let a = setInterval(async () => {
        document.querySelector(contentContainer) && (clearInterval(a), await wait(500), main())
    }, 1e3)
}

function main() {
    startsWithAR(document.title) && (document.querySelector(pageBackground)?.classList.add("rtl"), document.querySelector(pageIconAndControlsContainer)?.classList.add("rtl")), document.querySelectorAll(autoDirElementsSelectors).forEach(a => {
        if (a.setAttribute("dir", "auto"), a.matches(tableOfContentsBlock)) {
            let b = a.querySelectorAll("a [role='button'] > div");
            b.forEach(a => {
                a.style.marginInlineStart = a.style.marginLeft, a.style.marginLeft = ""
            })
        }
    });

    document.querySelectorAll('.notion-quote-block').forEach(processQuoteBlock);

    let a = new MutationObserver(a => {
        a.forEach(a => {
            if ("TITLE" === a.target.tagName) {
                let e = a.addedNodes[0].textContent ?? "", b = document.querySelector(pageBackground),
                    c = document.querySelector(pageIconAndControlsContainer);
                startsWithAR(e) ? (b?.classList.add("rtl"), c?.classList.add("rtl")) : (b?.classList.remove("rtl"), c?.classList.remove("rtl"))
            }
            if ("childList" === a.type && a.addedNodes.length) a.addedNodes.forEach(f => {
                if (f.nodeType !== Node.ELEMENT_NODE) return;
                let b = f, g = b.matches(".notion-column_list-block"), h = b.querySelectorAll(".notion-column-block");
                for (let d = 0; d < (g ? h.length : 1); d++) {
                    if (g && (b = h.item(d).firstElementChild), autoDirElementsSelectors.split(",").some(a => b.matches(a)) && b.setAttribute("dir", "auto"), b.matches(`${imageBlock}, ${videoBlock}, ${audioBlock}, ${fileBlock}, ${embedBlock}, ${bookmarkBlock}`)) {
                        let i = b.querySelector(captionBlockSelector);
                        i && (i.dir = "auto")
                    }
                    let c = a.previousSibling;
                    if (c && (b.matches(todoBlock) && c.matches(todoBlock) || b.matches(bulletedListBlock) && c.matches(bulletedListBlock) || b.matches(numberedListBlock) && c.matches(numberedListBlock) || b.matches(textBlock) && c.matches(textBlock))) {
                        let j = c.querySelector("[placeholder]:not([placeholder='']");
                        startsWithAR(j.innerText) && (b.dir = "rtl")
                    }
                    if (b.matches(`${tableOfContentsBlock} div div`)) {
                        let e = b.querySelector("a [role='button'] > div");
                        e.style.marginInlineStart = e.style.marginLeft, e.style.marginLeft = ""
                    }
                }

                // Process notion-quote-block when nodes are added
                if (b.matches('.notion-quote-block')) {
                    processQuoteBlock(b);
                } else {
                    let quoteBlocks = b.querySelectorAll('.notion-quote-block');
                    quoteBlocks.forEach(processQuoteBlock);
                }

            }); else if ("characterData" === a.type) {
                let d = ((a.target.parentElement?.closest(todoBlock) ?? a.target.parentElement?.closest(bulletedListBlock)) ?? a.target.parentElement?.closest(numberedListBlock)) ?? a.target.parentElement?.closest(textBlock);
                a.target.textContent?.trim() && !startsWithAR(a.target.textContent) && d?.dir === "rtl" && (d.dir = "auto");

                let quoteBlock = a.target.parentElement?.closest('.notion-quote-block');
                if (quoteBlock) {
                    processQuoteBlock(quoteBlock);
                }
            }
        })
    });
    a.observe(document.querySelector(contentContainer), {
        childList: !0,
        characterData: !0,
        subtree: !0
    }), a.observe(document.querySelector("title"), {childList: !0})
}

function processQuoteBlock(block) {
    let textContent = block.innerText || block.textContent || '';
    let isRTL = startsWithAR(textContent.trim());
    let divElement = block.querySelector('blockquote > div');

    if (divElement) {
        if (isRTL) {
            divElement.style.borderLeft = 'none';
            divElement.style.borderRight = '3px solid currentColor';
        } else {
            divElement.style.borderRight = 'none';
            divElement.style.borderLeft = '3px solid currentColor';
        }
    }
}

function startsWithAR(a) {
    return /^[\u0621-\u064A]/.test(a)
}

function wait(a) {
    return new Promise(b => setTimeout(b, a))
}

window.addEventListener("load", active), setInterval(() => {
    let b = window.location.pathname;
    b !== a && (a = b, active())
}, 1e3)
