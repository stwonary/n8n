import type { IExecuteFunctions } from 'n8n-core';
import type { IDataObject, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { updateDisplayOptions, wrapData } from '@utils/utilities';
import { theHiveApiListQuery } from '../../transport';
import { genericFiltersCollection } from '../common.description';

const properties: INodeProperties[] = [genericFiltersCollection];

const displayOptions = {
	show: {
		resource: ['observable'],
		operation: ['count'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = [];

	const filtersValues = this.getNodeParameter('filters.values', i, []) as IDataObject[];

	responseData = await theHiveApiListQuery.call(
		this,
		'listObservable',
		filtersValues,
		undefined,
		undefined,
		true,
	);

	responseData = { count: responseData };

	const executionData = this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});

	return executionData;
}
