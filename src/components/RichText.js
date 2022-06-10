import NextImage from 'next/image'
import dynamic from 'next/dynamic'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

// --- Components
import Link from 'components/Link'
const DynamicCodeBlock = dynamic(() => import('components/CodeBlock'))

function options(links) {
  const findAsset = (id) => links?.assets.block.find((item) => item.sys.id === id)
  const findInlineEntry = (id) => links?.entries.inline.find((item) => item.sys.id === id)

  return {
    renderMark: {
      [MARKS.BOLD]: (text) => <span className="font-semibold text-black">{text}</span>,
      [MARKS.ITALIC]: (text) => <span className="italic">{text}</span>,
      [MARKS.CODE]: (text) => (
        <code className="font-mono not-italic text-sm px-1.5 py-1 rounded-md bg-gray-100">{text}</code>
      )
    },
    renderNode: {
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="font-semibold mt-8 mb-2">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="font-semibold mt-8 mb-2">{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4 last:mb-0">{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-circle list-inside mb-6 space-y-2">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-6 space-y-2">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="py-3 px-4 my-6 border-l-8 border-gray-100 bg-gray-50 rounded-r-xl">{children}</blockquote>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = findAsset(node.data.target.sys.id)

        return (
          <figure className="mb-6">
            <NextImage
              src={asset.url}
              height={asset.height || 300}
              width={asset.width || 400}
              alt={asset.description}
            />
            {asset.description && (
              <figcaption className="text-xs text-gray-400 text-center font-light">{asset.description}</figcaption>
            )}
          </figure>
        )
      },
      [BLOCKS.HR]: (node, children) => <hr className="my-12 w-1/5" />,
      [INLINES.HYPERLINK]: (node, children) => <Link href={node.data.uri}>{children}</Link>,
      [INLINES.EMBEDDED_ENTRY]: (node) => {
        const entry = findInlineEntry(node.data.target.sys.id)

        switch (entry.__typename) {
          case 'ContentEmbed': {
            const { title, embedUrl, type } = entry

            switch (type) {
              case 'Video': {
                return (
                  <figure>
                    <iframe
                      src={embedUrl}
                      title={title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full aspect-video rounded-lg shadow-lg"
                    />
                    <figcaption className="text-sm text-gray-500 text-center mt-2">{title}</figcaption>
                  </figure>
                )
              }
              case 'SoundCloud': {
                return (
                  <figure>
                    <iframe
                      src={embedUrl}
                      title={title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full rounded-lg shadow-lg"
                    />
                    <figcaption className="text-sm text-gray-500 text-center mt-2">{title}</figcaption>
                  </figure>
                )
              }
              case 'Tweet': {
                return (
                  <figure>
                    <iframe
                      src={embedUrl}
                      height="460"
                      width="640"
                      title={title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full rounded-lg"
                    />
                    <figcaption className="text-sm text-gray-500 text-center mt-1">{title}</figcaption>
                  </figure>
                )
              }
              default:
                return null
            }
          }
          case 'CodeBlock': {
            return <DynamicCodeBlock {...entry} />
          }
          default:
            return null
        }
      }
    }
  }
}

const RichText = ({ content }) => {
  return documentToReactComponents(content?.json, options(content?.links))
}

export default RichText