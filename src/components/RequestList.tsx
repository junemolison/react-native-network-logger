import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Button from './Button';
import SearchBar from './SearchBar';
import Filter from './Filter';
import { FlashList } from '@shopify/flash-list';

interface Props {
  requests: NetworkRequestInfo[];
  onPressItem: (item: NetworkRequestInfo) => void;
  onShowMore: () => void;
  showDetails: boolean;
}

const RequestList: React.FC<Props> = ({
  requests,
  onPressItem,
  onShowMore,
  showDetails,
}) => {
  const styles = useThemedStyles(themedStyles);

  const [searchValue, onChangeSearchText] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(requests);

  const [httpMethod, onChangeHttpMethods] = useState('');
  const [httpCode, onChangeHttpCode] = useState(0);

  useEffect(() => {
    const filtered = requests.filter((request) => {
      const value = searchValue.toLowerCase().trim();

      return (
        (request.url.toLowerCase().includes(value) ||
          request.gqlOperation?.toLowerCase().includes(value)) &&
        request.method.includes(httpMethod) &&
        request.status.toString().includes(httpCode.toString())
      );
    });

    setFilteredRequests(filtered);
  }, [requests, searchValue, httpMethod, httpCode]);

  return (
    <View style={styles.container}>
      {!showDetails && (
        <>
          <SearchBar value={searchValue} onChangeText={onChangeSearchText} />
          <Filter
            onChangeHttpMethods={onChangeHttpMethods}
            onChangeHttpCode={onChangeHttpCode}
          />
        </>
      )}
      <FlashList
        keyExtractor={(item) => item.id}
        estimatedItemSize={110}
        ListHeaderComponent={() => (
          <Button onPress={onShowMore} style={styles.more}>
            More
          </Button>
        )}
        data={filteredRequests}
        renderItem={({ item }) => (
          <ResultItem request={item} onPress={() => onPressItem(item)} />
        )}
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
