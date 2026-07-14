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

export default function BlockRenderer({ block, number }: { block: ContentBlock; number: string }) {
  switch (block.type) {
    case "featureGrid":
      return <FeatureGrid number={number} {...block} />;
    case "calloutSplit":
      return <CalloutSplit number={number} {...block} />;
    case "bandStatement":
      return <BandStatement number={number} {...block} />;
    case "loopDiagram":
      return <LoopDiagram number={number} {...block} />;
    case "steps":
      return <Steps number={number} {...block} />;
    case "cardLinks":
      return <CardLinks number={number} {...block} />;
    case "imageText":
      return <ImageText number={number} {...block} />;
    case "twoListSplit":
      return <TwoListSplit number={number} {...block} />;
    case "testimonialBlock":
      return <TestimonialBlock number={number} {...block} />;
    case "textBand":
      return <TextBand number={number} {...block} />;
    case "bioBlock":
      return <BioBlock number={number} {...block} />;
    case "definitionList":
      return <DefinitionList number={number} {...block} />;
    default:
      return null;
  }
}
