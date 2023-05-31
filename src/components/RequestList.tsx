import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Button from './Button';
import SearchBar from './SearchBar';
import Filter from './Filter';
import { FlashList } from '@shopify/flash-list';
import { NetworkRequestInfoRow } from 'src/types';

interface Props {
  requestsInfo: NetworkRequestInfoRow[];
  onPressItem: (item: NetworkRequestInfo['id']) => void;
  options: { text: string; onPress: () => void }[];
  showDetails: boolean;
}

const RequestList: React.FC<Props> = ({
  requestsInfo,
  onPressItem,
  options,
  showDetails,
}) => {
  const styles = useThemedStyles(themedStyles);

  const [searchValue, onChangeSearchText] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(requestsInfo);

  const [httpMethod, onChangeHttpMethods] = useState('');
  const [httpCode, onChangeHttpCode] = useState(0);

  useEffect(() => {
    const filtered = requestsInfo.filter((request) => {
      const value = searchValue.toLowerCase().trim();

      return (
        (request.url.toLowerCase().includes(value) ||
          request.gqlOperation?.toLowerCase().includes(value)) &&
        request.method.includes(httpMethod) &&
        request.status.toString().includes(httpCode.toString())
      );
    });

    setFilteredRequests(filtered);
  }, [requestsInfo, searchValue, httpMethod, httpCode]);


  const renderItem = useCallback(
    ({ item }: { item: NetworkRequestInfoRow }) => (
      <ResultItem request={item} onPress={() => onPressItem(item.id)} />
    ),
    [onPressItem]
  );

  return (
    <View style={styles.container}>
      {!showDetails && (
        <>
          <SearchBar
            value={searchValue}
            onChangeText={onChangeSearchText}
            options={options}
          />
          <Filter
            onChangeHttpMethods={onChangeHttpMethods}
            onChangeHttpCode={onChangeHttpCode}
          />
        </>
      )}
      <FlashList
        keyExtractor={(item) => item.id}
        estimatedItemSize={110}
        data={filteredRequests}
        renderItem={renderItem}
      />
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    more: {
      marginLeft: 10,
    },
  });

export default RequestList;
