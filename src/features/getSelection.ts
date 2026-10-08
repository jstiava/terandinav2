import { $getSelection, $isRangeSelection, BaseSelection } from '@payloadcms/richtext-lexical/lexical';
import { $isTableSelection } from '@lexical/table';

const getSelection = (selection: BaseSelection | null = null) => {
	selection ||= $getSelection()

	if ($isRangeSelection(selection) || $isTableSelection(selection)) {
		return selection
	}

	return null;
}

export default getSelection;
