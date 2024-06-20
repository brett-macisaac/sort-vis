
import utils from "../../standard_ui/utils";

// The sorting algorithms.
const sortAlgos = {

    async BubbleSort(pElements, pAscending)
    {
        // Determine the comparison operator to use.
        const lCompOp = pAscending ? utils.compOps.G : utils.compOps.L;

        for (let lIndexUnsortedUpper = pElements.current.elements.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
        {
            for (let i = 1; i <= lIndexUnsortedUpper; ++i)
            {
                if (pElements.current.stop)
                    return;

                if (await pElements.current.compare(i - 1, lCompOp, i))
                {
                    await pElements.current.swap(i - 1, i);
                }
            }

            // pElements.SetElementSorted(lIndexUnsortedUpper);
        }
        
        // The first element is guaranteed to be sorted (but its colour isn't set in the for loops).
        // pElements.SetElementSorted(0);
    },

    async CocktailShakerSort(pElements, pAscending)
    {
        /* These two variables are the min and max indexes of the segment of pElements that is unsorted. Initially, the 
        entire array is unsorted. i.e. the unsorted segment ranges from index lIndexUnsortedLower to lIndexUnsortedUpper/
        */
        let lIndexUnsortedLower = 0; // The lowest index of the container's unsorted segment.
        let lIndexUnsortedUpper = pElements.current.length - 1; // The highest index of the container's unsorted segment.

        /* A flag that, when true, indicates that no swaps occurred during one iteration of the below while loop, 
        meaning that the array is sorted. 
        */
        let lNoSwaps;

        // The comparison operator that's used when going from low to high.
        const lCompOpLowToHigh = pAscending ? utils.compOps.G : utils.compOps.L;

        // The comparison operator that's used when going from low to high.
        const lCompOpHighToLow = pAscending ? utils.compOps.L : utils.compOps.G;

        /* Iterate until the unsorted segment has a size of zero. The size of the unsorted segment is 
        'lIndexUnsortedUpper - lIndexUnsortedLower + 1', meaning that if 
        lIndexUnsortedLower < lIndexUnsortedUpper, the size is 0 (or less).
        */
        while (lIndexUnsortedLower < lIndexUnsortedUpper)
        {
            // Reset the 'no swaps' flag to true; if a swap occurs, it's set to false.
            lNoSwaps = true;
            
            /* Get the highest value of the unsorted segment of the container and put it in the correct position 
            (index lIndexUnsortedUpper).
            */
            for (let i = lIndexUnsortedLower; i < lIndexUnsortedUpper; ++i) // Min to max (ascend).
            {
                if (pElements.current.stop)
                    return;

                if (await pElements.current.compare(i, lCompOpLowToHigh, i + 1))
                {
                    await pElements.current.swap(i, i + 1);
                    lNoSwaps = false;
                }
                
            }
            // await pElements.SetElementSorted(lIndexUnsortedUpper, true);
            --lIndexUnsortedUpper; // Decrease the size of the unsorted segment by 1.

            /* Get the lowest value of the unsorted segment of the container and put it in the correct position 
            (index lIndexUnsortedLower).
            */
            for (let i = lIndexUnsortedUpper; i > lIndexUnsortedLower; --i) // Max to min (descend).
            {
                if (pElements.current.stop)
                    return;

                if (await pElements.current.compare(i, lCompOpHighToLow, i - 1))
                { 
                    await pElements.current.swap(i, i - 1);
                    lNoSwaps = false;
                }
                
            }
            // await pElements.SetElementSorted(lIndexUnsortedLower, true);
            ++lIndexUnsortedLower; // Decrease the size of the unsorted segment by 1.
            
            // If no swaps occurred, the array is sorted; therefore, end the loop.
            if (lNoSwaps)
            { 
                // await pElements.SetElementRangeColour(lIndexUnsortedLower - 1, lIndexUnsortedUpper + 1, pElements.colours.sorted, true);
                break; 
            }
            
        }

    },

    async SelectionSort(pElements, pAscending)
    {
        // Determine the comparison operator to use.
        const lCompOp = pAscending ? utils.compOps.G : utils.compOps.L;

        let lIndexElementToSwap;

        for (let lIndexUnsortedUpper = pElements.current.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
        {
            lIndexElementToSwap = 0;

            for (let i = 1; i <= lIndexUnsortedUpper; ++i)
            {
                if (pElements.current.stop)
                    return;
                
                if (await pElements.current.compare(i, lCompOp, lIndexElementToSwap))
                {
                    lIndexElementToSwap = i;
                }
            }

            await pElements.current.swap(lIndexElementToSwap, lIndexUnsortedUpper);

            // pElements.SetElementSorted(lIndexUnsortedUpper);
        }

        // The first element is guaranteed to be sorted (but its colour isn't set in the for loops).
        // pElements.SetElementSorted(0);
    },

    async InsertionSort(pElements, pAscending)
    {
        // The value to insert upon each iteration of the for-loop.
        let lValueToInsert;
            
        // The number of values that are shifted in the while loop. This is only used to highlight the shifted elements.
        let lNumShifts = 0;
        
        // The operator to use in the while loop's condition.
        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;
        
        /* 
        * The segment of the array from index 'lIndexUnsortedMin' to 'pElements.current.length - 1' is the unsorted segment
        of the container. 
        * Initially, lIndexUnsortedMin is assigned the value 1, meaning that the value at index 0 is assumed to be sorted.
        * After each iteration of this for-loop, the size of the unsorted segment is reduced by 1.
        */
        for (let lIndexUnsortedMin = 1; lIndexUnsortedMin < pElements.current.length; ++lIndexUnsortedMin)
        {
            // The value to insert in this for-loop iteration is that at the lowest index of the array's unsorted segment.
            // lValueToInsert = pElements.GetClientHeight(lIndexUnsortedMin);
            lValueToInsert = pElements.current.elements[lIndexUnsortedMin];
            
            // Highlight the value that is to be inserted into the sorted segment.
            // await pElements.SetElementColour(lIndexUnsortedMin, pElements.colours.compared, true);

            // Highlight the sorted segment.
            // await pElements.SetElementRangeColour(0, lIndexUnsortedMin - 1, pElements.colours.swapped, true);

            // Remove colours.
            // pElements.SetElementRangeColour(0, lIndexUnsortedMin, pElements.colours.default);

            // The index of the (sorted) sublist at which lValueToInsert will be inserted.
            let lIndexOfInsert = lIndexUnsortedMin;

            for (; lIndexOfInsert > 0 && await pElements.current.compareValue(lIndexOfInsert - 1, lOperator, lValueToInsert, false); 
                --lIndexOfInsert)
            {
                if (pElements.current.stop)
                    return;

                await pElements.current.setValue(lIndexOfInsert, pElements.current.elements[lIndexOfInsert - 1]);

                // Record the shift.
                ++lNumShifts;
            }

            await pElements.current.setValue(lIndexOfInsert, lValueToInsert);

            // Highlight the value that was inserted.
            // await pElements.SetElementColour(lIndexOfInsert, pElements.colours.compared, false);
            
            // Highlight the values that were shifted up to accomodate for the value that was inserted.
            // await pElements.SetElementRangeColour(lIndexOfInsert + 1, lIndexOfInsert + lNumShifts, pElements.colours.swapped, true);
            
            // Remove the highlights.
            //pElements.SetBarColour(lIndexOfInsertM1 + 1, BarColourEnum.Standard, false);
            // await pElements.SetElementRangeColour(lIndexOfInsert, lIndexOfInsert + lNumShifts, pElements.colours.default, false);

            // Clear the number of shifts.
            lNumShifts = 0;
        }

        // pElements.SetElementRangeColour(0, pElements.current.length - 1, pElements.colours.sorted, true);
    },

    async QuickSort(pElements, pAscending)
    {
        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;

        // const lColourSortIndex = "#0f5099";

        const SortValue = async (pElements, aStart, aEnd) =>
        {
            // The index of the value that is to be placed into its sorted position.
            let lIndexPivot = aEnd;

            // The index at which lIndexPivot's value will ultimately be placed.
            let lIndexOfSort = aStart;

            // Highlight the segment from aStart to aEnd.
            // await pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.swapped, true);

            // Highlight the value that is to be placed into its sorted position.
            // await pElements.SetElementColour(lIndexPivot, pElements.colours.compared, true);

            // Remove colours.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default);
            
            // Highlight the index lIndexOfSort.
            // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

            for (let i = aStart; i < aEnd; ++i)
            {
                if (pElements.current.stop)
                    return;

                if (await pElements.current.compare(lIndexPivot, lOperator, i))
                {
                    // Swap current value with the one at lIndexOfSort.
                    if (i !== lIndexOfSort)
                        await pElements.current.swap(i, lIndexOfSort);

                    // pElements.SetElementColour(lIndexOfSort, pElements.colours.default);
                    ++lIndexOfSort;
                    // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
                }
                else if (i === lIndexOfSort)
                {
                    // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
                }
        
            }

            // Move the pivot's value into its sorted position.
            if (lIndexOfSort !== lIndexPivot)
            { await pElements.current.swap(lIndexOfSort, lIndexPivot); }

            // Indicate that the value at lIndexOfSort is in its sorted position.
            // await pElements.SetElementSorted(lIndexOfSort, true);

            // Return the index of the value sorted by this algorithm.
            return lIndexOfSort;
        }

        const SplitElements = async (pElements, aStart, aEnd) => 
        {
            if (pElements.current.stop) return;

            if (aStart < aEnd)
            {
                const lIndexSortedValue = await SortValue(pElements, aStart, aEnd);

                if (pElements.current.stop) return;

                // Highlight the lower segment.
                // await pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.compared, false);

                // if (pElements.current.stop) return;

                // Highlight the upper segment.
                // await pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.swapped, true);

                // Remove colours.
                // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.default);
                // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.default);

                await SplitElements(pElements, aStart, lIndexSortedValue - 1);

                await SplitElements(pElements, lIndexSortedValue + 1, aEnd);
            }
            else if (aStart === aEnd)
            {
                // await pElements.SetElementSorted(aStart, true);
            }

        }

        /* If await isn't used here, the user can still interact with UI elements that they shouldn't be able to. This is
        because when an 'await' is encountered within SplitElements, SplitElements is removed from the call stack, 
        meaning that QuickSort can continue, which results in QuickSort ending prematurely, which causes gElements.Sort(...)
        to return, after which DisableUIForSorting is called with a false argument, which causes the UI elements to be 
        enabled before the sorting process has completed.  */
        await SplitElements(pElements, 0, pElements.current.length - 1);
    },

    async QuickSortRandomPivot(pElements, pAscending)
    {
        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;

        // const lColourSortIndex = "#0f5099";

        const SortValue = async (pElements, aStart, aEnd) =>
        {
            // The index of the value that is to be placed into its sorted position.
            let lIndexPivot = utils.getRandomInt(aStart, aEnd);

            await pElements.current.swap(lIndexPivot, aEnd, true);

            lIndexPivot = aEnd;

            // The index at which lIndexPivot's value will ultimately be placed.
            let lIndexOfSort = aStart;

            // Highlight the segment from aStart to aEnd.
            // await pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.swapped, true);

            // Highlight the value that is to be placed into its sorted position.
            // await pElements.SetElementColour(lIndexPivot, pElements.colours.compared, true);

            // Remove colours.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default);
            
            // Highlight the index lIndexOfSort.
            // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

            for (let i = aStart; i < aEnd; ++i)
            {   
                if (pElements.current.stop)
                    return;

                if (await pElements.current.compare(lIndexPivot, lOperator, i))
                {
                    // Swap current value with the one at lIndexOfSort.
                    if (i != lIndexOfSort)
                        await pElements.current.swap(i, lIndexOfSort);

                    // pElements.SetElementColour(lIndexOfSort, pElements.colours.default);
                    ++lIndexOfSort;
                    // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
                }
                else if (i == lIndexOfSort)
                {
                    // await pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
                }
        
            }

            // Move the pivot's value into its sorted position.
            if (lIndexOfSort != lIndexPivot)
            { await pElements.current.swap(lIndexOfSort, lIndexPivot); }

            // Indicate that the value at lIndexOfSort is in its sorted position.
            // await pElements.SetElementSorted(lIndexOfSort, true);

            // Return the index of the value sorted by this algorithm.
            return lIndexOfSort;
        }

        const SplitElements = async (pElements, aStart, aEnd) => 
        {
            if (pElements.stop) return;

            if (aStart < aEnd)
            {
                const lIndexSortedValue = await SortValue(pElements, aStart, aEnd);

                if (pElements.stop) return;

                // Highlight the lower segment.
                // await pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.compared, false);

                // if (pElements.stop) return;

                // Highlight the upper segment.
                // await pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.swapped, true);

                // Remove colours.
                // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.default);
                // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.default);

                await SplitElements(pElements, aStart, lIndexSortedValue - 1);

                await SplitElements(pElements, lIndexSortedValue + 1, aEnd);
            }
            else if (aStart === aEnd)
            {
                // await pElements.SetElementSorted(aStart, true);
            }

        }

        await SplitElements(pElements, 0, pElements.current.length - 1);
    },

    async MergeSort(pElements, pAscending)
    {
        const lOperator = pAscending ? utils.compOps.LE : utils.compOps.GE;

        // const lColourUpper = "#0f5099";
        // const lColourLower = "#cc241f";
        // const lColourMerged = "#5226a3";

        const Merge = async (pElements, aStart, aMid, aEnd) =>
        {
            if (pElements.stop)
                return;

            // Change the colours of the two segments.
            // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
            // await pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

            // Remove the colours.
            // await pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, true);
            
            // Create a temporary container to house the merged segment.
            const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
            let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

            // (a). The current indexes of the lower and upper segments, respectively.
            let lIndexLowerSegment = aStart;
            let lIndexUpperSegment = aMid + 1;

            // (b). The 'current' index of lMerger.
            let lMergerIndex = 0;
            
            // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
            while (true) // (c).
            {
                if (pElements.stop)
                    return;

                if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
                {
                    if (await pElements.current.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment, false)) // (e).
                    {
                        lMerger[lMergerIndex++] = pElements.current.elements[lIndexLowerSegment++];
                    }
                    else // (f).
                    {
                        lMerger[lMergerIndex++] = pElements.current.elements[lIndexUpperSegment++];;
                    }
                    
                }
                else if (lIndexLowerSegment <= aMid) // (g).
                {
                    lMerger[lMergerIndex++] = pElements.current.elements[lIndexLowerSegment++];
                }
                else if (lIndexUpperSegment <= aEnd) // (h).
                {
                    lMerger[lMergerIndex++] = pElements.current.elements[lIndexUpperSegment++];
                }
                else // (i).
                {
                    break;
                }
                
            }

            // Change the colours of the two segments.
            // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
            // await pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

            // Copy the values from lMerger into the appropriate indexes of pElements.
            for (let i = aStart; i <= aEnd; ++i) 
            { 
                if (pElements.stop)
                    return;

                await pElements.current.setValue(i, lMerger[i - aStart]);
                // await pElements.SetElementColour(i, lColourMerged, true);
            }
            
            // Remove the colours.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, false);
        }

        const SplitAndMerge = async (pElements, aStart, aEnd) => 
        {
            if (aStart >= aEnd)
            { return; }
            
            // Calculate the middle index.
            let lMid = Math.floor((aStart + aEnd) / 2);

            if (pElements.stop)
                return;
            
            // Highlight the lower segment (the segment that is about to be split).
            // pElements.SetElementRangeColour(aStart, lMid, lColourLower);

            // Highlight the upper segment (the segment that is about to be split).
            // await pElements.SetElementRangeColour(lMid + 1, aEnd, lColourUpper, true);

            // Remove the colour on the upper segment.
            // await pElements.SetElementRangeColour(lMid + 1, aEnd, pElements.colours.default, true);
            
            // Split and merge the lower half of the current segment (aStart to lMid).
            // Once this returns, said lower half will have been sorted.
            await SplitAndMerge(pElements, aStart, lMid);

            if (pElements.stop)
                return;

            // Highlight the lower segment (the segment that is about to be split).
            // pElements.SetElementRangeColour(aStart, lMid, lColourLower);

            // Highlight the upper segment (the segment that is about to be split).
            // await pElements.SetElementRangeColour(lMid + 1, aEnd, lColourUpper, true);

            // Remove the colour on the lower segment.
            // await pElements.SetElementRangeColour(aStart, lMid, pElements.colours.default, true);
            
            // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
            // Once this returns, said upper half will have been sorted.
            await SplitAndMerge(pElements, lMid + 1, aEnd);
            
            // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
            await Merge(pElements, aStart, lMid, aEnd);
        }

        await SplitAndMerge(pElements, 0, pElements.current.length - 1);

        // pElements.SetElementRangeColour(0, pElements.current.length - 1, pElements.colours.sorted, true);
    },

    async MergeSortIterative(pElements, pAscending)
    {
        const lOperator = pAscending ? utils.compOps.LE : utils.compOps.GE;

        const lColourUpper = "#0f5099";
        const lColourLower = "#cc241f";
        const lColourMerged = "#5226a3";

        const Merge = async (pElements, aStart, aMid, aEnd) =>
        {
            if (pElements.current.stop) return;

            // Change the colours of the two segments.
            // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
            // await pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

            // if (pElements.current.stop) return;

            // Remove the colours.
            // await pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, true);
            
            // Create a temporary container to house the merged segment.
            const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
            let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

            // (a). The current indexes of the lower and upper segments, respectively.
            let lIndexLowerSegment = aStart;
            let lIndexUpperSegment = aMid + 1;

            // (b). The 'current' index of lMerger.
            let lMergerIndex = 0;
            
            // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
            while (true) // (c).
            {
                if (pElements.current.stop) return;

                if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
                {
                    if (await pElements.current.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment, false)) // (e).
                    {
                        lMerger[lMergerIndex++] = pElements.current.elements[lIndexLowerSegment++];
                    }
                    else // (f).
                    {
                        lMerger[lMergerIndex++] = pElements.current.elements[lIndexUpperSegment++];
                    }
                    
                }
                else if (lIndexLowerSegment <= aMid) // (g).
                {
                    lMerger[lMergerIndex++] = pElements.current.elements[lIndexLowerSegment++];
                }
                else if (lIndexUpperSegment <= aEnd) // (h).
                {
                    lMerger[lMergerIndex++] = pElements.current.elements[lIndexUpperSegment++];
                }
                else // (i).
                {
                    break;
                }
                
            }

            // Change the colours of the two segments.
            // pElements.SetElementRangeColour(aStart, aMid, lColourLower, false);
            // await pElements.SetElementRangeColour(aMid + 1, aEnd, lColourUpper, true);

            // Copy the values from lMerger into the appropriate indexes of pElements.
            for (let i = aStart; i <= aEnd; ++i) 
            { 
                if (pElements.stop) return;

                await pElements.current.setValue(i, lMerger[i - aStart]);
                // await pElements.SetElementColour(i, lColourMerged, true);
            }
            
            // Remove the colours.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default, false);
        }

        // (a).
        let l_segment_size; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
        let l_start; // First index of segment (first index of lower half).
        let l_mid; // Middle index of segment (last index of lower half, first index of lower half).
        let l_end; // Last index of segment (last index of upper half).

        // (b). Not necessary to make these variables, but it does help with readability.
        let l_container_max_index = pElements.current.length - 1;
        let l_container_size = pElements.current.length;

        // (c). Calculate and store the maximum length of a segment.
        let l_max_segment_size = 1;
        while (l_max_segment_size < l_container_size)
        { l_max_segment_size *= 2; }

        for (l_segment_size = 2; l_segment_size <= l_max_segment_size; l_segment_size *= 2) // (d).
        {
            for (l_start = 0; l_start <= l_container_max_index - Math.floor(l_segment_size / 2); l_start += l_segment_size) // (e).
            {
                // (f). Calculate middle index of segment lStart to lEnd (max index of lower half).
                l_mid = l_start + Math.floor((l_segment_size / 2)) - 1;

                // (g). Calculate max index of segment lStart to lEnd (max index of upper half).
                let l_end_candidate = l_start + l_segment_size - 1;
                if (l_end_candidate < l_container_max_index)
                {
                    l_end = l_end_candidate;
                }
                else
                {
                    l_end = l_container_max_index;
                }

                // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
                await Merge(pElements, l_start, l_mid, l_end);

                if (pElements.current.stop) return;
            }
            
        }

        // pElements.SetElementRangeColour(0, pElements.current.length - 1, pElements.colours.sorted, true);
    },

    async HeapSort(pElements, pAscending, pSort = true)
    {
        const MaxHeapify = async (pElements, aIndexLastNode, aIndexParentNode) => 
        {
            // (a).
            let lIndexMaxValue = aIndexParentNode;

            // (b).
            let lIndexLeftChild = 2 * aIndexParentNode + 1;
            let lIndexRightChild = 2 * aIndexParentNode + 2;

            if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the left child's value is higher than that of its parent.
                if (await pElements.current.compare(lIndexLeftChild, utils.compOps.G, lIndexMaxValue, false))
                {
                    lIndexMaxValue = lIndexLeftChild;
                }

            }

            if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the right child's value is higher than that of the current max.
                if (await pElements.current.compare(lIndexRightChild, utils.compOps.G, lIndexMaxValue, false))
                {
                    lIndexMaxValue = lIndexRightChild;
                }
            }

            if (lIndexMaxValue != aIndexParentNode) // (d).
            {
                // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
                await pElements.current.swap(lIndexMaxValue, aIndexParentNode);

                await MaxHeapify(pElements, aIndexLastNode, lIndexMaxValue); // (e).
            }

        }

        const MinHeapify = async (pElements, aIndexLastNode, aIndexParentNode) => 
        {
            // (a).
            let lIndexMinValue = aIndexParentNode;

            // (b).
            let lIndexLeftChild = 2 * aIndexParentNode + 1;
            let lIndexRightChild = 2 * aIndexParentNode + 2;

            if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the left child's value is higher than that of its parent.
                if (await pElements.current.compare(lIndexLeftChild, utils.compOps.L, lIndexMinValue, false))
                {
                    lIndexMinValue = lIndexLeftChild;
                }

            }

            if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the right child's value is higher than that of the current max.
                if (await pElements.current.compare(lIndexRightChild, utils.compOps.L, lIndexMinValue, false))
                {
                    lIndexMinValue = lIndexRightChild;
                }
                
            }

            if (lIndexMinValue != aIndexParentNode) // (d).
            {
                // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
                await pElements.current.swap(lIndexMinValue, aIndexParentNode, true);

                await MinHeapify(pElements, aIndexLastNode, lIndexMinValue); // (e).
            }

        }


        let lIndexLowestParentNode = Math.floor((pElements.current.length / 2) - 1);

        for (let i = lIndexLowestParentNode; i >= 0; --i)
        {
            if (pElements.current.stop) return;

            pAscending ? await MaxHeapify(pElements, pElements.current.length - 1, i) : 
                         await MinHeapify(pElements, pElements.current.length - 1, i);
        }

        if (pSort)
        {
            for (let lIndexLastNode = pElements.current.length - 1; lIndexLastNode >= 0;)
            {
                if (pElements.current.stop) return;
    
                await pElements.current.swap(0, lIndexLastNode, true);
    
                if (pElements.stop) return;
                
                // await pElements.SetElementSorted(lIndexLastNode, true);
    
                if (pElements.stop) return;
    
                pAscending ? await MaxHeapify(pElements, --lIndexLastNode, 0) :
                             await MinHeapify(pElements, --lIndexLastNode, 0);
            }
        }
    },

    async ShellSort(pElements, pAscending)
    {
        // source: https://www.geeksforgeeks.org/shellsort/

        // The operator to use in the while loop's condition.
        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;

        let n = pElements.current.length;
    
        /*
        * Perform insertion sort on all sublists of pElements where each sublist is comprised of elements of pElements that
        are 'gap' indexes apart from each other.
        */
        for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap / 2))
        {
            // The maximum index (which is an index of pElements) of the current sublist.
            let lIndexMaxSubList = gap;

            /*
            * Each iteration of this for loop performs an insertion sort on one of the sublists. 
            * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
            * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
            times (equal to its (final) length minus 1).
            * Each sublist mustn't contain the same element as another sublist.
            * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
            */
            for (; lIndexMaxSubList < n; ++lIndexMaxSubList)
            {
                const lValueToInsert = pElements.current.elements[lIndexMaxSubList]; //= arr[i];

                // The index of the sublist at which lValueToInsert will be inserted.
                let lIndexOfInsert = lIndexMaxSubList;

                // The lowest index of the sublist.
                let lIndexMinSublist = lIndexMaxSubList % gap;

                for (; lIndexOfInsert > lIndexMinSublist && await pElements.current.compareValue(lIndexOfInsert - gap, lOperator, lValueToInsert); 
                    lIndexOfInsert -= gap)
                {
                    if (pElements.current.stop) return;

                    pElements.current.setValue(lIndexOfInsert, pElements.current.elements[lIndexOfInsert - gap]);
                }

                pElements.current.setValue(lIndexOfInsert, lValueToInsert);
            }

        }

        // pElements.SetElementRangeColour(0, pElements.current.length - 1, pElements.colours.sorted, true);
    }
};

// Add an algorithm which just gets the list into heap form (doesn't actually sort).
sortAlgos.Heapify = async function(pElements, pAscending)
{
    await sortAlgos.HeapSort(pElements, pAscending, false);
};

// The names of the sorting algorithms.
const sortAlgoNames = [
    "BUBBLE",
    "COCKTAIL SHAKER",
    "SELECTION",
    "INSERTION",
    "QUICK",
    "QUICK RANDOM",
    "MERGE",
    "MERGE ITERATIVE",
    "HEAP",
    "SHELL",
    "HEAPIFY"
];

const sortAlgos2 = {
    "BUBBLE": sortAlgos.BubbleSort,
    "COCKTAIL SHAKER": sortAlgos.CocktailShakerSort,
    "SELECTION": sortAlgos.SelectionSort,
    "INSERTION": sortAlgos.InsertionSort,
    "QUICK": sortAlgos.QuickSort,
    "QUICK RANDOM": sortAlgos.QuickSortRandomPivot,
    "MERGE": sortAlgos.MergeSort,
    "MERGE ITERATIVE": sortAlgos.MergeSortIterative,
    "HEAP": sortAlgos.HeapSort,
    "SHELL": sortAlgos.ShellSort,
    "HEAPIFY": sortAlgos.Heapify
}


// The ranges used for the sliders.
const ranges = {
    speed:       { min: 1,  max: 1000 },
    numElements: { min: 10, max: 500 }
}

export { sortAlgoNames, sortAlgos2 as sortAlgos, ranges };