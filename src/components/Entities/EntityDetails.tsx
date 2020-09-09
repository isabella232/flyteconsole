import { Dialog } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { contentMarginGridUnits } from 'common/layout';
import { WaitForData } from 'components/common';
import { EntityDescription } from 'components/Entities/EntityDescription';
import { useProject } from 'components/hooks';
import { LaunchWorkflowForm } from 'components/Launch/LaunchWorkflowForm/LaunchWorkflowForm';
import { ResourceIdentifier } from 'models';
import * as React from 'react';
import { entitySections } from './constants';
import { EntityDetailsHeader } from './EntityDetailsHeader';
import { EntityExecutions } from './EntityExecutions';
import { EntitySchedules } from './EntitySchedules';

const useStyles = makeStyles((theme: Theme) => ({
    metadataContainer: {
        display: 'flex',
        marginBottom: theme.spacing(5),
        marginTop: theme.spacing(2),
        width: '100%'
    },
    descriptionContainer: {
        flex: '2 1 auto',
        marginRight: theme.spacing(2)
    },
    executionsContainer: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        margin: `0 -${theme.spacing(contentMarginGridUnits)}px`
    },
    schedulesContainer: {
        flex: '1 2 auto',
        marginRight: theme.spacing(30)
    }
}));

export interface EntityDetailsProps {
    id: ResourceIdentifier;
}

/** A view which optionally renders description, schedules, executions, and a
 * launch button/form for a given entity. Note: not all components are suitable
 * for use with all entities (not all entities have schedules, for example).
 */
export const EntityDetails: React.FC<EntityDetailsProps> = ({ id }) => {
    const sections = entitySections[id.resourceType];
    const project = useProject(id.project);
    const styles = useStyles();
    const [showLaunchForm, setShowLaunchForm] = React.useState(false);
    const onLaunch = () => setShowLaunchForm(true);
    const onCancelLaunch = () => setShowLaunchForm(false);

    return (
        <>
            <WaitForData {...project}>
                <EntityDetailsHeader
                    project={project.value}
                    id={id}
                    launchable={!!sections.launch}
                    onClickLaunch={onLaunch}
                />
                <div className={styles.metadataContainer}>
                    {!!sections.description ? (
                        <div className={styles.descriptionContainer}>
                            <EntityDescription id={id} />
                        </div>
                    ) : null}
                    {!!sections.schedules ? (
                        <div className={styles.schedulesContainer}>
                            <EntitySchedules id={id} />
                        </div>
                    ) : null}
                </div>
                {!!sections.executions ? (
                    <div className={styles.executionsContainer}>
                        <EntityExecutions id={id} />
                    </div>
                ) : null}
                {/* TODO: LaunchWorkflowForm needs to be made generic */}
                {!!sections.launch ? (
                    <Dialog
                        scroll="paper"
                        maxWidth="sm"
                        fullWidth={true}
                        open={showLaunchForm}
                    >
                        <LaunchWorkflowForm
                            onClose={onCancelLaunch}
                            workflowId={id}
                        />
                    </Dialog>
                ) : null}
            </WaitForData>
        </>
    );
};