import { Flex, HStack, Input,Text } from "@chakra-ui/react"
import { ColorModeSwitcher } from "components/ColorModeSwitcher"
import moment from "moment"
import { Trace } from "types/plugins/trace"
import { formatDuration } from "../../utils/date"
import SpanGraph from "./SpanGraph"
import { useState } from "react"
import { ETraceViewType, IViewRange, ViewRangeTimeUpdate } from "../../types/types"
import CollapseIcon from "components/icons/Collapse"
import {  AiOutlineDown, AiOutlineUp } from "react-icons/ai"
import IconButton from "components/button/IconButton"
import RadionButtons from "components/RadioButtons"
import {addParamToUrl} from 'utils/url'
interface Props {
    trace: Trace
    viewRange: IViewRange
    updateNextViewRangeTime: (update: ViewRangeTimeUpdate) => void
    updateViewRangeTime: any
    collapsed: boolean
    onGraphCollapsed: any
    searchCount: number
    prevResult: any
    nextResult: any
    viewType: string
    onViewTypeChange: any
    search: string
}

const TraceDetailHeader = ({ trace, viewRange, updateNextViewRangeTime, updateViewRangeTime, collapsed, onGraphCollapsed, searchCount, prevResult, nextResult, viewType, onViewTypeChange,search }: Props) => {
    const [search1, setSearch] = useState(search)
    const onSearchChange = (v) => {
        setSearch(v)
        addParamToUrl({search: v})
    }
    return (<>
        <Flex justifyContent="space-between" alignItems="center">
            <HStack>
                <CollapseIcon collapsed={collapsed} onClick={onGraphCollapsed} />
                <Text>{trace.traceName}</Text>
                <Text textStyle="annotation">{trace.traceID.slice(0, 7)}</Text>
            </HStack>
            <HStack spacing={1}>
                {viewType == ETraceViewType.TraceJSON ?
                    <Text fontSize="0.95rem" layerStyle="gradientText" mr="20px">Click code area and Press Command+F to search </Text>
                    : ((viewType != ETraceViewType.TraceFlamegraph && viewType != ETraceViewType.TraceSpansView)&& <HStack spacing={0}>
                        <HStack spacing={0} position="relative">
                            <Input width="240px" placeholder="Search.." value={search1} onChange={e => onSearchChange(e.currentTarget.value)} />
                            <Text textStyle="annotation" width="30px" position="absolute" right="0" mt="2px">{searchCount}</Text>
                        </HStack>
                        {viewType == ETraceViewType.TraceTimelineViewer && <><IconButton onClick={prevResult} isDisabled={search == ''} fontSize="1rem"><AiOutlineUp /></IconButton>
                            <IconButton onClick={nextResult} isDisabled={search == ''} fontSize="1rem"><AiOutlineDown /></IconButton></>}
                        {/* <Button size="sm" variant="outline" onClick={prevResult} isDisabled={search == ''}></Button> */}
                    </HStack>)}
                <RadionButtons theme="brand" fontSize="0.85rem" spacing={0} value={viewType} onChange={v => onViewTypeChange(v)} options={[
                    { label: "Timeline", value: ETraceViewType.TraceTimelineViewer },
                    { label: "FlameGraph", value: ETraceViewType.TraceFlamegraph },
                    { label: "NodeGraph", value: ETraceViewType.TraceGraph },
                    { label: "Spans", value: ETraceViewType.TraceSpansView },
                    { label: "Statistics", value: ETraceViewType.TraceStatistics },
                    { label: "JSON", value: ETraceViewType.TraceJSON },
                ]} />
                <ColorModeSwitcher />
            </HStack>
        </Flex>
        <HStack className="label-bg" px="2" py="1" fontSize="0.9rem" spacing={4}>
            <HStack>
                <Text opacity="0.8">Start time</Text>
                <Text>{moment(trace.startTime / 1000).format('yy-MM-DD hh:mm:ss.SSS')}</Text>
            </HStack>
            <HStack>
                <Text opacity="0.8">Duration</Text>
                <Text>{formatDuration(trace.duration)}</Text>
            </HStack>
            <HStack>
                <Text opacity="0.8">Services</Text>
                <Text>{trace.services.length}</Text>
            </HStack>
            <HStack>
                <Text opacity="0.8">Depth</Text>
                <Text>{Math.max(...trace.spans.map(span => span.depth)) + 1}</Text>
            </HStack>
            <HStack>
                <Text opacity="0.8">Spans</Text>
                <Text>{trace.spans.length}</Text>
            </HStack>
            <HStack>
                <Text opacity="0.8">Errors</Text>
                <Text>{trace.errorsCount}</Text>
            </HStack>
        </HStack>
        {!collapsed && <SpanGraph trace={trace} viewRange={viewRange} updateNextViewRangeTime={updateNextViewRangeTime} updateViewRangeTime={updateViewRangeTime} />}
    </>)
}

export default TraceDetailHeader