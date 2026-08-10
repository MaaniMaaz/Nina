import type { ContentBlock } from "@/content/types";
import FeatureGrid from "./FeatureGrid";
import CalloutSplit from "./CalloutSplit";
import BandStatement from "./BandStatement";
import LoopDiagram from "./LoopDiagram";
import Steps from "./Steps";
import CardLinks from "./CardLinks";
import ImageText from "./ImageText";
import TwoListSplit from "./TwoListSplit";
import TestimonialBlock from "./TestimonialBlock";
import TextBand from "./TextBand";
import BioBlock from "./BioBlock";
import DefinitionList from "./DefinitionList";
import CareToolkit from "./CareToolkit";
import Dispensary from "./Dispensary";
import IconCardGrid from "./IconCardGrid";
import ConditionExplorer from "./ConditionExplorer";
import CarePlanToolkit from "./CarePlanToolkit";

export default function BlockRenderer({
  block,
  number,
  blockIndex = 0,
}: {
  block: ContentBlock;
  number: string;
  blockIndex?: number;
}) {
  switch (block.type) {
    case "featureGrid":
      return <FeatureGrid number={number} blockIndex={blockIndex} {...block} />;
    case "calloutSplit":
      return <CalloutSplit number={number} blockIndex={blockIndex} {...block} />;
    case "bandStatement":
      return <BandStatement number={number} blockIndex={blockIndex} {...block} />;
    case "loopDiagram":
      return <LoopDiagram number={number} {...block} />;
    case "steps":
      return <Steps number={number} {...block} />;
    case "cardLinks":
      return <CardLinks number={number} blockIndex={blockIndex} {...block} />;
    case "imageText":
      return <ImageText number={number} blockIndex={blockIndex} {...block} />;
    case "twoListSplit":
      return <TwoListSplit number={number} {...block} />;
    case "testimonialBlock":
      return <TestimonialBlock number={number} blockIndex={blockIndex} {...block} />;
    case "textBand":
      return <TextBand number={number} {...block} />;
    case "bioBlock":
      return <BioBlock number={number} blockIndex={blockIndex} {...block} />;
    case "definitionList":
      return <DefinitionList number={number} {...block} />;
    case "careToolkit":
      return <CareToolkit number={number} {...block} />;
    case "dispensary":
      return <Dispensary number={number} {...block} />;
    case "iconCardGrid":
      return <IconCardGrid number={number} {...block} />;
    case "conditionExplorer":
      return <ConditionExplorer number={number} {...block} />;
    case "carePlanToolkit":
      return <CarePlanToolkit number={number} {...block} />;
    default:
      return null;
  }
}
