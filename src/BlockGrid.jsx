import React, { useEffect, useRef, useState } from "react"
import GridLayout, { useContainerWidth } from "react-grid-layout"
import Alert from "keystone_ui-react/src/Alert.jsx"
import Button from "keystone_ui-react/src/Button.jsx"
import Input from "keystone_ui-react/src/Input.jsx"
import { Label } from "keystone_ui-react/src/FieldText.jsx"
import Section from "keystone_ui-react/src/Section.jsx"
import useLayout from "./useLayout"
import { allowances, chooseBlock, dropBlock, fillBlock, gridItems, placeBlocks, removeBlock } from "./blocks"
import { chosenShape, narrowPlaces } from "./shape"
import { holdToStart, swallowPress } from "./hold"
import { redraw } from "./content"
import { dragStopped } from "./remove_target"

const RESIZE_HANDLES = [ "se" ]

const typeOf = (block_types, key) => block_types.find((blockType) => blockType.key === key)

const named = (block_types, key) => typeOf(block_types, key)?.name ?? `Unknown block type (${key})`

const matching = (block_types, search) => block_types.filter((blockType) => blockType.name.toLowerCase().includes(search.trim().toLowerCase()))

const grouped = (block_types) => block_types.reduce((groups, blockType) => {
  const name = blockType.group ?? ""
  const group = groups.find((found) => found.name === name) ?? groups[groups.push({ name, types: [] }) - 1]
  group.types.push(blockType)

  return groups
}, [])

const drawn = (id, html) => {
  const content = document.createElement("div")
  content.dataset.blockContent = id
  content.innerHTML = html

  return content
}

const BlockContent = ({ id, name, html }) => {
  const slot = useRef(null)
  const shown = useRef(null)
  const [ adopted, setAdopted ] = useState(false)

  useEffect(() => {
    const content = document.querySelector(`[data-block-content="${id}"]`) ?? (html ? drawn(id, html) : null)
    if (content && content.parentElement !== slot.current) slot.current.appendChild(content)
    redraw(content, html, shown.current)
    shown.current = html
    setAdopted(Boolean(content))
  }, [ id, html ])

  return (
    <>
      {adopted ? null : name}
      <div ref={slot} />
    </>
  )
}

const usedUp = (blockType, blocks) => blockType.once && blocks.some((block) => block.type === blockType.key)

export default function BlockGrid({ base, token, emptyMessage, editing: startsEditing = false, ...initial }) {
  const { layout: current, error, send } = useLayout(base, token, initial)
  const { block_types = [], blocks = [], grid = {}, contents = {} } = current
  const limits = current.limits ?? block_types
  const { width, containerRef, mounted } = useContainerWidth({ measureBeforeMount: true })
  const { columns, rowHeight, gap, narrow } = chosenShape(width, grid)
  const layout = gridItems(narrow ? narrowPlaces(blocks, limits, columns) : blocks, limits)
  const dragged = useRef(null)
  const removeTargetRef = useRef(null)
  const blocksDialogRef = useRef(null)
  const [ editing, setEditing ] = useState(startsEditing)
  const [ picking, setPicking ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ selected, setSelected ] = useState(null)
  const filled = blocks.find((block) => block.id === selected)
  const fields = typeOf(block_types, filled?.type)?.fields ?? []

  const startDragging = (blockType) => (event) => {
    dragged.current = blockType
    event.dataTransfer.setData("text/plain", blockType.key)
  }

  const dropConfig = {
    enabled: true,
    onDragOver: () => dragged.current ? { w: dragged.current.width, h: dragged.current.height } : false
  }

  const held = editing ? swallowPress() : { ...holdToStart(() => setEditing(true)), "data-hold-to-edit": true }

  useEffect(() => {
    const dialog = blocksDialogRef.current
    if (!dialog) return
    if (picking && !dialog.open) dialog.showModal?.()
    if (!picking && dialog.open) dialog.close?.()
  }, [ picking ])

  const letGo = (placed, item, event) => {
    const stopped = dragStopped({
      layout: placed,
      item,
      pointer: event,
      target: removeTargetRef.current?.getBoundingClientRect(),
      fixed: !allowances(blocks.find((block) => block.id === item.i) ?? {}, limits).removed
    })

    stopped.remove ? removeBlock(send, stopped.remove) : placeBlocks(send, stopped.place)
  }

  const dropped = (_layout, item) => {
    if (dragged.current) dropBlock(send, dragged.current.key, item)
    dragged.current = null
  }

  return (
    <div>
      {editing && <dialog ref={blocksDialogRef} data-blocks-dialog onClose={() => setPicking(false)}>
        <Section title="Blocks" spacing="sm">
        <Label htmlFor="ks-blocks-search">Search blocks</Label>
        <Input id="ks-blocks-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="mb-2" />
        {block_types.length === 0
          ? <p>There are no blocks to add.</p>
          : grouped(matching(block_types, search)).map((group) => (
              <React.Fragment key={group.name}>
                {group.name && <h3 className="ks-section-title">{group.name}</h3>}
                <ul>
                  {group.types.map((blockType) => (
                    <li key={blockType.key} data-block-type={blockType.key} className="flex items-center justify-between gap-2 py-1" draggable="true" onDragStart={startDragging(blockType)}>
                      <span>
                        {blockType.name}
                        {blockType.description && <span className="ks-section-subtitle block">{blockType.description}</span>}
                      </span>
                      <Button variant="secondary" size="sm" type="button" disabled={usedUp(blockType, blocks)} onClick={() => chooseBlock(send, () => setPicking(false), blockType.key)}>{usedUp(blockType, blocks) ? "Added" : "Add"}</Button>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ))}
        </Section>
        <Button variant="secondary" size="sm" type="button" data-close-blocks onClick={() => setPicking(false)}>Close</Button>
      </dialog>}
      {error && <Alert type="error" message={error} className="mb-3" />}
      {editing
        ? <>
            <Button variant="secondary" size="sm" type="button" data-open-blocks onClick={() => setPicking(true)}>Add a block</Button>
            <Button variant="secondary" size="sm" type="button" data-stop-editing onClick={() => setEditing(false)}>Done</Button>
          </>
        : <Button variant="secondary" size="sm" type="button" data-start-editing onClick={() => setEditing(true)}>Edit</Button>}
      {blocks.length === 0 && <p>{emptyMessage}</p>}
      {fields.length > 0 && (
        <div data-block-fields className="mb-3">
          {fields.map((field) => (
            <div key={field.key} className="mb-2">
              <Label htmlFor={`ks-block-field-${field.key}`}>{field.label}</Label>
              <Input key={`${selected}-${field.key}`} id={`ks-block-field-${field.key}`} type="text" defaultValue={filled.content?.[field.key] ?? ""} onBlur={(event) => fillBlock(send, selected, { ...filled.content, [field.key]: event.target.value })} />
            </div>
          ))}
        </div>
      )}
      {editing && <div ref={removeTargetRef} data-remove-target className="ks-remove-target" aria-label="Drop a block here to remove it">✕</div>}
      <div ref={containerRef} data-block-grid style={{ overflow: "hidden", visibility: mounted ? "visible" : "hidden" }}>
        <GridLayout width={width} layout={layout} gridConfig={{ cols: columns, rowHeight, margin: [ gap, gap ] }} resizeConfig={{ enabled: editing && !narrow, handles: RESIZE_HANDLES }} dragConfig={{ enabled: editing && !narrow }} dropConfig={dropConfig} onDrop={dropped} onDragStop={(placed, _from, item, _placeholder, event) => letGo(placed, item, event)} onResizeStop={(placed) => placeBlocks(send, placed)}>
          {blocks.map((block) => (
            <div key={block.id} data-block={block.id} {...held} onClick={() => setSelected(block.id)}>
              <BlockContent id={block.id} name={named(limits, block.type)} html={contents[block.id]} />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  )
}
