import './ContentSection.scss';

import { useContext, useEffect, useState } from 'react';

import { INotebookMetadata } from '@/shared/notebook-metadata';
import { notebooksService } from '@/shared/notebooks.service';
import { NotebooksContext } from '@/shared/notebooks-context';

import { Pagination } from '../shared/Pagination/Pagination';
import { ContentSectionHeader } from './ContentSectionHeader/ContentSectionHeader';
import { NotebooksList } from './NotebooksList/NotebooksList';

const notebooksPerPageOptions = [5, 10, 25, 50];

export const ContentSection = (): JSX.Element => {
  const { selectedTags, searchValue, sort, page, setPage } = useContext(NotebooksContext);

  const [notebooks, setNotebooks] = useState<INotebookMetadata[]>([]);
  const [filteredNotebooksLength, setFilteredNotebooksLength] = useState<number>(0);

  const [itemsPerPage, setItemsPerPage] = useState<number>(notebooksPerPageOptions[0]);

  const { notebooksTotalCount } = notebooksService;

  const totalPages = Math.ceil(filteredNotebooksLength / itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [selectedTags, searchValue, sort, setPage]);

  useEffect(() => {
    const [paginatedNotebooks, totalSearchedNotebooks] = notebooksService.getNotebooks({
      tags: selectedTags,
      searchValue,
      sort,
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });
    setNotebooks(paginatedNotebooks);
    setFilteredNotebooksLength(totalSearchedNotebooks);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTags, searchValue, sort, page, itemsPerPage]);

  return (
    <section className="flex-col flex-1 content-section">
      <ContentSectionHeader
        totalCount={notebooksTotalCount}
        filteredCount={filteredNotebooksLength}
      ></ContentSectionHeader>
      <NotebooksList items={notebooks}></NotebooksList>
      {Boolean(notebooks.length) && (
        <Pagination
          itemsPerPageOptions={notebooksPerPageOptions}
          itemsPerPage={itemsPerPage}
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
          onChangeItemsPerPage={setItemsPerPage}
        ></Pagination>
      )}
    </section>
  );
};
