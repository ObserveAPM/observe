
import { PanelPluginComponents } from "types/plugin";
import PanelEditor from "./Editor";
import TracePanelWrapper from "./Trace";
import { mockTraceDataForTestDataDs } from "./mocks/mockData";
import icon from './trace.svg'
import { PanelTypeTrace } from "./types/types";


const panelComponents: PanelPluginComponents = {
    panel: TracePanelWrapper,
    editor: PanelEditor,
    mockDataForTestDataDs:  mockTraceDataForTestDataDs,
    settings: {
        type: PanelTypeTrace,
        icon,
        initOptions: {
            defaultService: "",
            enableEditService: true,
            interaction: {
                enable: false,
                actions: []
            }
        },
    }
}

export default  panelComponents