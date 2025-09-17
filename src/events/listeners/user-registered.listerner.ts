import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import * as userEventsService from "../user-events.service";

// Listener for handling user registration events
@Injectable()
export class UserRegisteredListener {

    private readonly logger = new Logger(UserRegisteredListener.name);

    @OnEvent('user.registered')
    handleUserRegisteredEvent(event: userEventsService.UserRegisteredEvent): void {
        const { user, timestamp } = event;

        this.logger.log(`User registered: ${user.email} at ${timestamp}`);
        // Perform other actions when a user registers, for example:
        // Send a welcome email
        // Add the user to the mailing list
        // Log or analyze data
    }
}
