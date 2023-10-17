import { SettingsContainer } from '@/components/layout/SettingsContainer';
import { ActivityIndicator } from '@/components/ui/v2/ActivityIndicator';
import { ArrowSquareOutIcon } from '@/components/ui/v2/icons/ArrowSquareOutIcon';
import { Link } from '@/components/ui/v2/Link';
import { Text } from '@/components/ui/v2/Text';
import { useCurrentWorkspaceAndProject } from '@/features/projects/common/hooks/useCurrentWorkspaceAndProject';
import { RunServicePortDomain } from '@/features/projects/custom-domains/settings/components/RunServicePortDomain';
import { useGetRunServicesQuery } from '@/utils/__generated__/graphql';
import { useMemo } from 'react';

export default function RunServiceDomains() {
  const { currentProject, currentWorkspace } = useCurrentWorkspaceAndProject();

  const {
    data,
    loading,
    // refetch: refetchServices, // TODO refetch after update
  } = useGetRunServicesQuery({
    variables: {
      appID: currentProject.id,
      resolve: false,
      limit: 1000, // TODO consider pagination
      offset: 0,
    },
  });

  const services = useMemo(
    () => data?.app?.runServices.map((service) => service) ?? [],
    [data],
  );

  if (loading) {
    return (
      <ActivityIndicator
        delay={1000}
        label="Loading Run Services Domains..."
        className="justify-center"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {services.map((service) => (
        <SettingsContainer
          key={service.id}
          title={
            <div className="flex flex-row">
              <Text className="text-lg font-semibold">
                {service.config?.name ?? 'unset'}
              </Text>
              <Link
                href={`/${currentWorkspace.slug}/${currentProject.slug}/services`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                className="font-medium"
              >
                <ArrowSquareOutIcon className="m-1 mt-0 h-4 w-4" />
              </Link>
            </div>
          }
          description="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
          docsTitle={service.config?.name ?? 'unset'}
          docsLink="https://docs.nhost.io/"
          slotProps={{
            submitButton: {
              hidden: true,
            },
          }}
          className="grid gap-y-4 gap-x-4 px-4"
        >
          {service.config?.ports?.map((port) => (
            <RunServicePortDomain
              key={String(port.port)}
              service={service}
              port={port.port}
            />
          ))}
        </SettingsContainer>
      ))}
    </div>
  );
}
